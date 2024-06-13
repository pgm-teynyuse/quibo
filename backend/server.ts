import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { Server } from "socket.io";
import http from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Origin of your frontend application
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

interface CustomRequest extends Request {
  user?: {
    userId: number;
    email: string;
    username?: string;
  };
}

const validateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
      username?: string;
    };
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).json({ error: "Invalid token." });
  }
};

const getRoomName = (userId1: number, userId2: number) => {
  return [userId1, userId2].sort().join("-");
};

// Registration endpoint
app.post("/register", async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    street_name,
    house_number,
    postal_code,
    city,
  } = req.body;
  console.log("Received data:", {
    username,
    email,
    password,
    first_name,
    last_name,
    street_name,
    house_number,
    postal_code,
    city,
  });

  try {
    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      console.log("Email or username already in use:", email, username);
      return res
        .status(400)
        .json({ error: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profiles: {
          create: {
            first_name,
            last_name,
            street_name,
            house_number,
            postal_code,
            city,
          },
        },
      },
      include: {
        profiles: true,
      },
    });

    console.log("User and profile created:", user);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Login attempt with:", { email, password });

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Voeg extra gegevens toe aan de token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log("Login successful for user:", email);
    res.json({ token });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/protected", validateToken, (req: CustomRequest, res: Response) => {
  res.status(200).send("This is a protected route");
});

app.get(
  "/api/verify-token",
  validateToken,
  (req: CustomRequest, res: Response) => {
    res.status(200).json({ message: "Token is valid" });
  }
);

app.get("/search-book/:isbn", async (req: Request, res: Response) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
    const book = response.data.items ? response.data.items[0].volumeInfo : null;

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const bookData = {
      title: book.title,
      authors: book.authors,
      publishedDate: book.publishedDate,
      description: book.description,
      pageCount: book.pageCount,
      categories: book.categories,
      thumbnail: book.imageLinks ? book.imageLinks.thumbnail : null,
      isbn,
    };

    res.json(bookData);
  } catch (error) {
    console.error("Error fetching book data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get(
  "/get-user-preferences",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const preferences = await prisma.userPreference.findUnique({
        where: { userId: req.user.userId },
      });

      if (!preferences) {
        return res.status(404).json({ error: "Preferences not found" });
      }

      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/save-user-preferences",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { booksPerRow } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const preferences = await prisma.userPreference.upsert({
        where: { userId: req.user.userId },
        update: { booksPerRow },
        create: { userId: req.user.userId, booksPerRow },
      });

      res.status(200).json(preferences);
    } catch (error) {
      console.error("Error saving user preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post("/add-book", async (req: Request, res: Response) => {
  const {
    title,
    authors,
    publishedDate,
    description,
    pageCount,
    categories,
    thumbnail,
    isbn,
  } = req.body;
  try {
    const existingBook = await prisma.book.findUnique({ where: { isbn } });

    if (existingBook) {
      return res.json(existingBook);
    }

    const book = await prisma.book.create({
      data: {
        title,
        authors,
        publishedDate,
        description,
        pageCount,
        categories,
        thumbnail,
        isbn,
      },
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Error adding book to database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/add-to-shelf",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { bookId, swap } = req.body;
    try {
      const bookShelf = await prisma.bookShelf.create({
        data: {
          userId: req.user.userId,
          bookId: Number(bookId),
          swap: swap || false,
        },
      });

      res.status(201).json(bookShelf);
    } catch (error) {
      console.error("Error adding book to user's shelf:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get(
  "/my-books",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const books = await prisma.bookShelf.findMany({
        where: {
          userId: req.user.userId,
        },
        include: {
          book: true,
        },
      });
      res.json(books);
    } catch (error) {
      console.error("Error fetching user's books:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.delete(
  "/remove-from-shelf/:id",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    try {
      const bookShelfEntry = await prisma.bookShelf.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!bookShelfEntry || bookShelfEntry.userId !== req.user?.userId) {
        return res.status(404).json({
          error:
            "Book not found or you don't have permission to delete this book.",
        });
      }

      await prisma.bookShelf.delete({
        where: {
          id: Number(id),
        },
      });

      res.status(200).json({ message: "Book removed from shelf." });
    } catch (error) {
      console.error("Error removing book from shelf:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.patch(
  "/update-book-status/:id",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { swap } = req.body;

    try {
      const bookShelfEntry = await prisma.bookShelf.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          book: true,
        },
      });

      if (!bookShelfEntry || bookShelfEntry.userId !== req.user?.userId) {
        return res.status(404).json({
          error:
            "Book not found or you don't have permission to update this book.",
        });
      }

      const updatedBookShelfEntry = await prisma.bookShelf.update({
        where: {
          id: Number(id),
        },
        data: {
          swap: swap,
        },
        include: {
          book: true,
        },
      });

      res.status(200).json(updatedBookShelfEntry);
    } catch (error) {
      console.error("Error updating book status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get(
  "/books-for-swap",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const searchQuery = req.query.search as string;

    try {
      const books = await prisma.bookShelf.findMany({
        where: {
          swap: true,
          userId: {
            not: req.user.userId,
          },
          book: {
            title: {
              contains: searchQuery,
              mode: "insensitive", // case-insensitive search
            },
          },
        },
        include: {
          book: true,
          user: true,
        },
      });
      res.json(books);
    } catch (error) {
      console.error("Error fetching books for swap:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


app.get(
  "/my-books-for-swap",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const books = await prisma.bookShelf.findMany({
        where: {
          userId: req.user.userId,
          swap: true,
        },
        include: {
          book: true,
        },
      });
      res.json(books);
    } catch (error) {
      console.error("Error fetching user's books for swap:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/swap-request",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { bookId, requestedBookId, ownerId } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const existingRequestForRequestedBook =
        await prisma.swapRequest.findFirst({
          where: {
            requesterId: req.user.userId,
            requestedBookId: requestedBookId,
          },
        });

      if (existingRequestForRequestedBook) {
        return res
          .status(400)
          .json({ error: "You have already requested a swap for this book." });
      }

      const existingRequestForBook = await prisma.swapRequest.findFirst({
        where: {
          requesterId: req.user.userId,
          bookId: bookId,
        },
      });

      if (existingRequestForBook) {
        return res.status(400).json({
          error: "You have already used this book in another swap request.",
        });
      }

      const swapRequest = await prisma.swapRequest.create({
        data: {
          requesterId: req.user.userId,
          ownerId,
          bookId,
          requestedBookId,
          status: "pending",
        },
        include: {
          book: true,
          requestedBook: true,
          requester: true,
          owner: true,
        },
      });

      res.status(201).json(swapRequest);
    } catch (error) {
      console.error("Error creating swap request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.patch(
  "/swap-request/:id/accept",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    try {
      const swapRequest = await prisma.swapRequest.update({
        where: { id: Number(id) },
        data: { status: "accepted" },
        include: {
          book: true,
          requestedBook: true,
          requester: true,
          owner: true,
        },
      });

      res.json(swapRequest);
    } catch (error) {
      console.error("Error accepting swap request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.patch(
  "/swap-request/:id/decline",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    try {
      const swapRequest = await prisma.swapRequest.update({
        where: { id: Number(id) },
        data: { status: "declined" },
        include: {
          book: true,
          requestedBook: true,
          requester: true,
          owner: true,
        },
      });

      res.json(swapRequest);
    } catch (error) {
      console.error("Error declining swap request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get(
  "/received-requests",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const receivedRequests = await prisma.swapRequest.findMany({
        where: {
          ownerId: req.user.userId,
        },
        include: {
          book: true,
          requestedBook: true,
          requester: {
            select: {
              email: true,
              user_id: true, // Include userId
            },
          },
        },
      });

      res.json(receivedRequests);
    } catch (error) {
      console.error("Error fetching received requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get(
  "/sent-requests",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const sentRequests = await prisma.swapRequest.findMany({
        where: {
          requesterId: req.user.userId,
        },
        include: {
          book: true,
          requestedBook: true,
          owner: true,
        },
      });

      res.json(sentRequests);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get(
  "/user/:userId/swap-shelf",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { userId } = req.params;

    try {
      const swapShelf = await prisma.bookShelf.findMany({
        where: {
          userId: Number(userId),
          swap: true,
        },
        include: {
          book: true,
        },
      });

      if (!swapShelf) {
        return res.status(404).json({ error: "Swap shelf not found." });
      }

      res.json(swapShelf);
    } catch (error) {
      console.error("Error fetching user's swap shelf:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.patch(
  "/swap-request/:id/alternative",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { alternativeBookId } = req.body;

    try {
      const swapRequest = await prisma.swapRequest.update({
        where: { id: Number(id) },
        data: {
          status: "alternative",
          alternativeBookId: Number(alternativeBookId),
        },
        include: {
          book: true,
          requestedBook: true,
          requester: true,
          owner: true,
        },
      });

      res.json(swapRequest);
    } catch (error) {
      console.error("Error accepting alternative swap request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/swap-request/:id/alternative",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { id } = req.params;
    const { alternativeBookId } = req.body;

    try {
      const originalRequest = await prisma.swapRequest.findUnique({
        where: { id: Number(id) },
        include: {
          book: true,
          requestedBook: true,
          requester: true,
          owner: true,
        },
      });

      if (!originalRequest) {
        return res
          .status(404)
          .json({ error: "Original swap request not found." });
      }

      const newRequest = await prisma.swapRequest.create({
        data: {
          requesterId: originalRequest.ownerId,
          ownerId: originalRequest.requesterId,
          bookId: alternativeBookId,
          requestedBookId: originalRequest.bookId,
          status: "pending",
        },
        include: {
          book: true,
          requestedBook: true,
          requester: true,
          owner: true,
        },
      });

      res.status(201).json(newRequest);
    } catch (error) {
      console.error("Error creating alternative swap request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/api/messages",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { receiverId, content } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const message = await prisma.message.create({
        data: {
          senderId: req.user.userId,
          receiverId: parseInt(receiverId, 10), // Ensure receiverId is an integer
          content,
        },
        include: {
          sender: { select: { username: true } },
          receiver: { select: { username: true } },
        },
      });

      // Emit the new message to the correct room
      const roomName = getRoomName(req.user.userId, parseInt(receiverId, 10));
      io.to(roomName).emit("newMessage", message);

      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);



app.get(
  "/api/messages/:userId",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    const { userId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: req.user.userId, receiverId: Number(userId) },
            { senderId: Number(userId), receiverId: req.user.userId },
          ],
        },
        include: {
          sender: { select: { username: true } },
          receiver: { select: { username: true } },
        },
      });
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (userId, otherUserId) => {
    const roomName = getRoomName(userId, otherUserId);
    socket.join(roomName);
    console.log(`User ${userId} joined room ${roomName}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on("error", (error) => {
    console.error(`Socket error: ${socket.id}, error: ${error}`);
  });
});

app.get(
  "/api/users",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const users = await prisma.user.findMany({
        where: {
          NOT: {
            user_id: req.user.userId,
          },
        },
        select: {
          user_id: true,
          username: true,
          email: true,
        },
      });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get(
  "/profile",
  validateToken,
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const userProfile = await prisma.user.findUnique({
        where: {
          user_id: req.user.userId,
        },
        include: {
          profiles: {
            include: {
              profilePicture: true, // Include the profile picture
            },
          },
        },
      });

      if (!userProfile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.get("/", (req, res) => {
  res.send("Hello, this is your Quibo backend running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

