"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import BookList from "../../components/Books/bookList";
import BookSwap from "../../components/Books/bookSwap";
import Loading from "../../components/Books/Loading";
import { BookShelfEntry } from "../../app/types/types";
import Modal from "@mui/material/Modal";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SnackbarCloseReason } from "@mui/material";

export interface BookData {
  id: number;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
  isbn: string;
}

const BooksForSwap: React.FC = () => {
  const [books, setBooks] = useState<BookShelfEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const [myBooks, setMyBooks] = useState<BookShelfEntry[]>([]);
  const [bookToSwap, setBookToSwap] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookShelfEntry | null>(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchBooksForSwap = async () => {
      try {
        const response = await axios.get<BookShelfEntry[]>(
          "http://localhost:3000/books-for-swap",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched books:", response.data);
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books for swap:", error);
      }
    };

    const fetchMyBooksForSwap = async () => {
      try {
        const response = await axios.get<BookShelfEntry[]>(
          "http://localhost:3000/my-books-for-swap",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched my books for swap:", response.data);
        setMyBooks(response.data);
      } catch (error) {
        console.error("Error fetching my books for swap:", error);
      }
    };

    if (user) {
      fetchBooksForSwap();
      fetchMyBooksForSwap();
    }
  }, [user]);

  const handleRequestSwap = async () => {
    if (!bookToSwap || !selectedBook) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/swap-request",
        {
          bookId: bookToSwap,
          requestedBookId: selectedBook.book?.id,
          ownerId: selectedBook.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Swap request created:", response.data);
      setSnackbarMessage("Swap request created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpen(false); // Close the modal on success
    } catch (error) {
      console.error("Error creating swap request:", error);
      if (
        (error as any).response &&
        (error as any).response.data &&
        (error as any).response.data.error
      ) {
        setSnackbarMessage((error as any).response.data.error);
      } else {
        setSnackbarMessage("Error creating swap request.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {books.length === 0 ? (
        <p>No books available for swap.</p>
      ) : (
        <BookList
          books={books}
          onSelectBook={(book) => {
            setSelectedBook(book);
            handleOpenModal();
          }}
        />
      )}

      <Modal open={open} onClose={handleCloseModal}>
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <div className="fixed bottom-0 flex w-full">
            {selectedBook && selectedBook.book && (
              <BookSwap
                selectedBook={selectedBook}
                myBooks={myBooks}
                bookToSwap={bookToSwap}
                setBookToSwap={setBookToSwap}
                handleRequestSwap={handleRequestSwap}
              />
            )}
          </div>
        </Slide>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        className="top-0"
      >
        <Alert
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BooksForSwap;
