import React from "react";
import BookCard from "../Books/bookCard";

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

interface BookGridProps {
  books: BookShelfEntry[];
  onRemoveBook: (id: number) => void;
  onUpdateBookStatus: (id: number, swap: boolean) => void;
  booksPerRow: number;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  onRemoveBook,
  onUpdateBookStatus,
  booksPerRow,
}) => {
  const renderBooksWithDividers = () => {
    const bookElements: React.ReactNode[] = [];

    for (let i = 0; i < books.length; i++) {
      bookElements.push(
        <BookCard
          key={books[i].id}
          entry={books[i]}
          onRemove={() => onRemoveBook(books[i].id)}
          onUpdateStatus={() => onUpdateBookStatus(books[i].id, !books[i].swap)}
        />
      );

      if ((i + 1) % booksPerRow === 0) {
        bookElements.push(
          <div
            key={`divider-${i}`}
            className="w-full rounded-md h-2 bg-gray-300 my-2"
          ></div>
        );
      }
    }

    return bookElements;
  };

  return (
    <div className="flex flex-wrap gap-1">{renderBooksWithDividers()}</div>
  );
};

export default BookGrid;
