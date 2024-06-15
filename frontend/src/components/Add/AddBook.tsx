"use client";
import { useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import React from "react";

interface BookData {
  id: any;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
  isbn: string;
}

const AddBook: React.FC = () => {
  const [isbn, setIsbn] = useState<string>("");
  const [book, setBook] = useState<BookData | null>(null);
  const [message, setMessage] = useState<string>("");
  const [swap, setSwap] = useState<boolean>(false);
  const { user } = useUser();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
  }

  const searchBook = async () => {
    try {
      const response = await axios.get<BookData>(
        `${apiUrl}/search-book/${isbn}`
      );
      setBook(response.data);
      setMessage("");
    } catch (error) {
      console.error("Error searching for book:", error);
      setMessage("Error searching for book");
    }
  };

  const addBookToShelf = async () => {
    if (!book) return;

    try {
      const bookResponse = await axios.post<BookData>(
        `${apiUrl}/add-book`,
        book
      );
      const bookId = bookResponse.data.id;

      await axios.post(
        `${apiUrl}/add-to-shelf`,
        { bookId, swap },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Book added to your shelf!");
      setMessage("Book added to your shelf!");
    } catch (error) {
      console.error("Error adding book to shelf:", error);
      setMessage("Error adding book to shelf");
    }
  };

  return (
    <div className="flex flex-col items-center w-full mb-4">
      <form className="flex h-11 items-center w-full max-w-lg bg-gray-200 rounded-full p-2 mb-4">
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="Enter ISBN"
          className="bg-gray-200 w-full border-none focus:outline-none p-2"
        />
        <button
          type="button"
          onClick={searchBook}
          className="ml-2 p-2 bg-q_primary-100 text-white rounded-full"
        >
          Search
        </button>
      </form>
      {message && <p className="text-red-500">{message}</p>}
      {book && (
        <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-lg">
          <h2 className="text-lg font-bold">{book.title}</h2>
          <p className="text-gray-600">{book.authors.join(", ")}</p>
          {book.thumbnail && (
            <img
              src={book.thumbnail}
              alt={book.title}
              className="w-full h-auto mt-2 rounded-md"
            />
          )}
          <label className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={swap}
              onChange={(e) => setSwap(e.target.checked)}
              className="mr-2"
            />
            Available for swap
          </label>
          <button
            onClick={addBookToShelf}
            className="mt-4 p-2 bg-q_primary-100 text-white rounded-full w-full"
          >
            Add to Shelf
          </button>
        </div>
      )}
    </div>
  );
};

export default AddBook;
