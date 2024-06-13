import React from "react";
import Slider from "react-slick";
import { BookShelfEntry } from "../../app/types/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ButtonIcon } from "../Button/button";
import { IconSwap, IconBook } from "../Icon/Icon";


interface BookSwapProps {
  selectedBook: BookShelfEntry;
  myBooks: BookShelfEntry[];
  bookToSwap: number | null;
  setBookToSwap: (id: number) => void;
  handleRequestSwap: () => void;
}

const BookSwap: React.FC<BookSwapProps> = ({
  selectedBook,
  myBooks,
  bookToSwap,
  setBookToSwap,
  handleRequestSwap,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="bg-q_bright p-4 h-q_modalH w-screen rounded-t-q_modal ">
      <div className="flex justify-center mb-4">
        <div className="bg-q_dark-10 w-20 h-2 rounded"></div>
      </div>
      <h1 className="text-titleNormal mt-8 text-q_primary-100 font-semibold">
        Swap Verzoek
      </h1>
      <div className="flex mt-1 gap-1 ">
        <IconBook className={"fill-q_primary-100 "} />
        <p className="text-label mt-1 flex gap-1 text-q_primary-100 font-semibold">
          {selectedBook.book?.title}
        </p>
      </div>
      <h2 className="mt-12 text-titleSmall text-q_primary-100">
        Selecteer een boek uit je swapkast
      </h2>
      {myBooks.length > 2 ? (
        <Slider {...settings} className="mt-4">
          {myBooks.map((myBook) => (
            <div
              key={myBook.book?.id}
              onClick={() => setBookToSwap(myBook.book?.id || 0)}
            >
              <img
                src={myBook.book?.thumbnail || "/default-book-cover.jpg"}
                alt={myBook.book?.title}
                className={`p-0.5 h-40 w-full object-cover rounded  ${bookToSwap === myBook.book?.id ? "border-4 border-q_tertiairy" : ""}`}
              />
              <p className=" text-label text-q_primary-100 font-semibold text-center">
                {myBook.book?.title}
              </p>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {myBooks.map((myBook) => (
            <div
              key={myBook.book?.id}
              onClick={() => setBookToSwap(myBook.book?.id || 0)}
            >
              <img
                src={myBook.book?.thumbnail || "/default-book-cover.jpg"}
                alt={myBook.book?.title}
                className={`p-0.5 h-40 w-38 object-cover rounded  ${bookToSwap === myBook.book?.id ? "border-4 border-q_tertiairy" : ""}`}
              />
              <p className=" text-q_primary-100 text-label">
                {myBook.book?.title}
              </p>
            </div>
          ))}
        </div>
      )}
      <ButtonIcon
        content="Swap"
        subtext="Verzoek voor de geselecteerde boek"
        className="mt-10"
        type="button"
        onClick={handleRequestSwap}
        icon={<IconSwap className={"mt-2 ml-2 fill-q_primary-100"} />}
      />
    </div>
  );
};

export default BookSwap;
