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

  console.log("user", user);

  const searchBook = async () => {
    try {
      const response = await axios.get<BookData>(
        `http://localhost:3000/search-book/${isbn}`
      );
      console.log(response.data);
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
        "http://localhost:3000/add-book",
        book
      );
      const bookId = bookResponse.data.id;

      await axios.post(
        "http://localhost:3000/add-to-shelf",
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
    <div>
      <input
        type="text"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        placeholder="Enter ISBN"
      />
      <button onClick={searchBook}>Search Book</button>
      {message && <p>{message}</p>}
      {book && (
        <div>
          <h2>{book.title}</h2>
          <p>{book.authors.join(", ")}</p>
          {book.thumbnail && <img src={book.thumbnail} alt={book.title} />}
          <label>
            <input
              type="checkbox"
              checked={swap}
              onChange={(e) => setSwap(e.target.checked)}
            />
            Available for swap
          </label>
          <button onClick={addBookToShelf}>Add to Shelf</button>
        </div>
      )}
    </div>
  );
};


export default AddBook;
