"use client";
import React, { useState } from "react";
import BookModal from "../../components/Books/BookModal";
import { BookData } from "../../app/types/types";

interface BookShelfEntry {
  id: number;
  book: BookData;
  swap: boolean;
}

interface BookCardProps {
  entry: BookShelfEntry;
  onRemove: () => void;
  onUpdateStatus: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  entry,
  onRemove,
  onUpdateStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSingleClick = () => {
    setIsModalOpen(true);
  };

  const handleDoubleClick = () => {
    onUpdateStatus();
  };

  const handleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick();
    } else {
      setClickTimeout(
        setTimeout(() => {
          handleSingleClick();
          setClickTimeout(null);
        }, 300)
      );
    }
  };

  return (
    <>
      <div>
        <div
          className={`border-2 ${
            entry.swap ? "border-q_tertiairy" : "border-transparent"
          } border-2 rounded-md box-border`}
          onClick={handleClick}
        >
          <div
            className={`w-q_book h-24 rounded-md overflow-hidden flex items-center justify-center ${
              entry.book.thumbnail ? "" : "bg-q_primary-100"
            }`}
          >
            {entry.book.thumbnail ? (
              <img
                src={entry.book.thumbnail}
                alt={entry.book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white  text-sm text-center">
                {entry.book.title}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus();
          }}
        >
          {entry.swap ? "" : ""}
        </button>
      </div>
      {isModalOpen && (
        <BookModal
          removeBook={onRemove}
          book={entry.book}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default BookCard;
