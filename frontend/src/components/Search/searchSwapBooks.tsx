"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookShelfEntry } from "../../app/types/types";
import { IconSearch } from "../Icon/Icon";

interface SearchBooksProps {
  setBooks: (books: BookShelfEntry[]) => void;
}

const SearchBooks: React.FC<SearchBooksProps> = ({ setBooks }) => {
  const [query, setQuery] = useState("");
  const [allBooks, setAllBooks] = useState<BookShelfEntry[]>([]);

  useEffect(() => {
    // Fetch all books initially
    const fetchBooks = async () => {
      try {
        const response = await axios.get<BookShelfEntry[]>(
          `http://localhost:3000/books-for-swap`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAllBooks(response.data);
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [setBooks]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (query) {
        const filteredBooks = allBooks.filter(
          (book) =>
            book.book &&
            book.book.title.toLowerCase().includes(query.toLowerCase())
        );
        setBooks(filteredBooks);
      } else {
        setBooks(allBooks);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, allBooks, setBooks]);

  return (
    <div className="flex justify-center w-full mb-4">
      <form className="flex h-11 items-center w-full max-w-lg bg-gray-200 rounded-full p-2">
        <button
          type="submit"
          className="p-2 focus:outline-none"
          onClick={(e) => e.preventDefault()}
        >
          <IconSearch className="fill-q_primary-100" />
        </button>
        <input
          type="text"
          placeholder="Zoek een boek..."
          className="bg-gray-200 w-full border-none focus:outline-none p-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchBooks;
