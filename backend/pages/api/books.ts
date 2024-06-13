// frontend/pages/api/books.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const validateToken = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as any).user = decoded;
    next();
  } catch (ex) {
    return res.status(400).json({ error: "Invalid token." });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    validateToken(req, res, async () => {
      const { googleId, title, authors, description, isbn } = req.body;

      if (!(req as any).user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      try {
        let book = await prisma.book.findUnique({
          where: { googleId },
        });

        if (!book) {
          book = await prisma.book.create({
            data: {
              googleId,
              title,
              authors,
              description,
              isbn,
            },
          });
        }

        const userBook = await prisma.userBook.create({
          data: {
            userId: (req as any).user.userId,
            bookId: book.book_id,
          },
        });

        res.status(201).json(userBook);
      } catch (error) {
        res.status(500).json({ error: "Error saving the book" });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
