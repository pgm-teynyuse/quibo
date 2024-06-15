import React, { useState } from "react";
import { BookShelfEntry } from "../../app/types/types";
import SearchBooks from "../Search/searchSwapBooks";

interface BookListProps {
  books: BookShelfEntry[];
  onSelectBook: (book: BookShelfEntry) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onSelectBook }) => {
  const [filteredBooks, setFilteredBooks] = useState<BookShelfEntry[]>(books);

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + "..."
      : title;
  };

  return (
    <div className="flex flex-col w-full">
      <SearchBooks setBooks={setFilteredBooks} />
      <div className="mb-4 text-label text-q_primary-100">
        <h2 className="text-titleSmall font-semibold mb-1">
          Boeken om te swappen
        </h2>
        <p>{filteredBooks.length} resultaten gevonden</p>
      </div>
      <div
        style={{ maxHeight: "70vh" }}
        className="flex pb-16 overflow-x-hidden overflow-auto flex-wrap"
      >
        {filteredBooks.map((entry) => (
          <div
            key={entry.id}
            className="w-1/2"
            onClick={() => onSelectBook(entry)}
          >
            <div className="p-1">
              {entry.book ? (
                <>
                  {entry.book.thumbnail ? (
                    <img
                      src={entry.book.thumbnail}
                      alt="Book Cover"
                      className="w-full h-56 rounded-q_s object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 rounded-q_s bg-gray-300 flex items-center justify-center">
                      <span className="text-white text-titleSwap text-center px-2">
                        {truncateTitle(entry.book.title, 20) || "No Title"}
                      </span>
                    </div>
                  )}
                  <h2 className="text-titleSwap mt-1 w-full text-q_primary-100 font-semibold">
                    {truncateTitle(entry.book.title, 20) || "No Title"}
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
