import { useState } from "react";
import axios from "axios";

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    description: string;
    imageLinks: {
      thumbnail: string;
    };
    industryIdentifiers: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

const SearchBooks = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<Book[]>([]);
  const [token, setToken] = useState<string | null>(null); // Voeg een state toe voor het token

  const searchBooks = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${query}&key=AIzaSyCMHQdxMpHThHCuzkERp6q1IKzuBCTacOM`
      );
      setBooks(response.data.items);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const saveBook = async (book: Book) => {
    try {
      await axios.post(
        "/api/books",
        {
          // Gebruik de juiste URL
          googleId: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "No authors found",
          description: book.volumeInfo.description,
          isbn: book.volumeInfo.industryIdentifiers
            .map((id) => id.identifier)
            .join(", "),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Book saved successfully");
    } catch (error) {
      console.error("Error saving the book", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter ISBN code"
      />
      <button onClick={searchBooks}>Search</button>
      <div>
        {books.map((book) => (
          <div key={book.id}>
            <h3>{book.volumeInfo.title}</h3>
            <p>
              {book.volumeInfo.authors
                ? book.volumeInfo.authors.join(", ")
                : "No authors found"}
            </p>
            <p>{book.volumeInfo.description}</p>
            <img
              src={book.volumeInfo.imageLinks?.thumbnail}
              alt={book.volumeInfo.title}
            />
            <button onClick={() => saveBook(book)}>Save Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;
