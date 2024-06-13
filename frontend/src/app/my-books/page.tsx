"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import BookGrid from "../../components/Books/bookGrid";
import { ButtonIconSmall } from "../../components/Button/button";
import { IconSettings } from "../../components/Icon/Icon";
import BookSettings from "../../components/Books/bookSettings";
import React from "react";

interface BookData {
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

interface BookShelfEntry {
  id: number;
  book: BookData;
  swap: boolean;
}

const MyBooks: React.FC = () => {
  const [books, setBooks] = useState<BookShelfEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [booksPerRow, setBooksPerRow] = useState<number>(4);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();

  const handleClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<BookShelfEntry[]>(
          "http://localhost:3000/my-books",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const fetchUserPreferences = async () => {
      try {
        const response = await axios.get<{ booksPerRow: number }>(
          "http://localhost:3000/get-user-preferences",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBooksPerRow(response.data.booksPerRow);
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    if (user) {
      fetchBooks();
      fetchUserPreferences();
    }
  }, [user]);

  const saveUserPreferences = async () => {
    try {
      await axios.post(
        "http://localhost:3000/save-user-preferences",
        { booksPerRow },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsChanged(false);
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  };

  const handleBooksPerRowChange = (newBooksPerRow: number) => {
    setBooksPerRow(newBooksPerRow);
    setIsChanged(true);
  };

  const removeBookFromShelf = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/remove-from-shelf/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooks(books.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error removing book from shelf:", error);
    }
  };

  const updateBookStatus = async (id: number, swap: boolean) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/update-book-status/${id}`,
        { swap },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBooks(books.map((entry) => (entry.id === id ? response.data : entry)));
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen overflow-auto">
      <div className="flex justify-between">
        <div className="w-5">
          <h1 className="text-titleNormal text-q_primary-100 mb-5">
            Mijn <strong>boekenkast</strong>
          </h1>
        </div>
        <ButtonIconSmall
          content="Bewerken"
          icon={<IconSettings />}
          onClick={handleClick}
          className="mb-4 fill-q_primary-100"
          type={"button"}
        />
      </div>
      <div className=" mb-52 overflow-y-auto">
        {" "}
        {books.length === 0 ? (
          <p>Je hebt geen boeken in uw kast.</p>
        ) : (
          <BookGrid
            books={books}
            onRemoveBook={removeBookFromShelf}
            onUpdateBookStatus={updateBookStatus}
            booksPerRow={booksPerRow}
          />
        )}
      </div>
      {isModalOpen && (
        <BookSettings
          booksPerRow={booksPerRow}
          onBooksPerRowChange={handleBooksPerRowChange}
          onSavePreferences={saveUserPreferences}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyBooks;
