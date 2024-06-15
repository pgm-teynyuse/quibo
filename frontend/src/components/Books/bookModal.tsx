import React from "react";
import { BookData } from "../../app/types/types";
import { NockBarBack } from "../NockBar/nock-bar";
import { ButtonIcon } from "../Button/button";
import { IconDelete } from "../Icon/Icon";

interface BookModalProps {
  book: BookData;
  onClose: () => void;
  removeBook: () => void;
}

const BookModal: React.FC<BookModalProps> = ({ book, onClose, removeBook }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-q_bright shadow-lg w-full h-full max-w-screen-lg max-h-screen-lg overflow-y-auto">
        <div className="p-4">
          <NockBarBack onClose={onClose} />
        </div>
        <div className="w-full relative h-72 bg-gray-300 mt-28">
          <div className="absolute -top-10 w-28 h-40 rounded-q_s border-2 border-q_primary-100 transform -translate-x-1/2 left-1/2">
            {book.thumbnail && (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-28 h-40 object-cover rounded-q_s"
              />
            )}
          </div>
          <div className="text-center pt-32">
            <p className="text-q_primary-100 text-titleNormal font-semibold">
              {book.title}
            </p>
            <p className="text-q_light text-titleSmall">{book.authors}</p>
            <p className="text-q_primary-100 mt-5 text-label">
              <strong>Conditie Score:</strong> 78%
            </p>
          </div>
        </div>
        <div className="p-4">
          <ButtonIcon
            content="Verwijderen"
            subtext="Verwijder deze boek uit je collectie"
            className=""
            icon={<IconDelete className={"fill-q_primary-100 mt-2.5 ml-1.5"} />}
            type={"button"}
            onClick={removeBook}
          />
        </div>
      </div>
    </div>
  );
};

export default BookModal;
