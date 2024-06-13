import React, { useState } from "react";
import { BookShelfEntry } from "../../app/types/types";
import SearchBooks from "../Search/searchSwapBooks";

interface BookListProps {
  books: BookShelfEntry[];
  onSelectBook: (book: BookShelfEntry) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onSelectBook }) => {
  const [filteredBooks, setFilteredBooks] = useState<BookShelfEntry[]>(books);

  return (
    <div className="flex flex-col w-full">
      <SearchBooks setBooks={setFilteredBooks} />
      <div className="mb-4 text-label text-q_primary-100">
        <h2 className="text-titleSmall font-semibold mb-1">Boeken om te swappen</h2>
        <p>{filteredBooks.length} resultaten gevonden</p>
      </div>
      <div className="flex flex-wrap">
        {filteredBooks.map((entry) => (
          <div
            key={entry.id}
            className="w-1/2"
            onClick={() => onSelectBook(entry)}
          >
            <div className="p-1">
              {entry.book ? (
                <>
                  {entry.book.thumbnail && (
                    <img
                      src={entry.book.thumbnail}
                      alt={entry.book.title}
                      className="w-full h-56 rounded-q_s object-cover"
                    />
                  )}
                  <h2 className="text-titleSmall mt-1 w-full text-q_primary-100 font-semibold">
                    {entry.book.title || "No Title"}
                  </h2>
                  <p className="mt-2 text-q_light text-label">
                    {entry.book.authors.join(", ") || "No Authors"}
                  </p>
                  <p className="text-q_tertiairy text-label">
                    @{entry.user.username || "No User"}
                  </p>
                </>
              ) : (
                <p className="text-gray-500">Book details are not available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
