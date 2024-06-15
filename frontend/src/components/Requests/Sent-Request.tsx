import React from "react";
import { RequestItemProps } from "../../app/types/types";
import { IconBook } from "../Icon/Icon";

const SentRequestItem = ({ request, handleAlternativeResponse }: RequestItemProps) => {
  return (
    <li className="p-4 border rounded mb-4">
      <div className="text-titleSmall flex text-q_primary-100 ">
        <IconBook className=" fill-q_primary-100" />
        {request.requestedBook.title}
      </div>
      <div className=" mt-1 mb-4 text-titleSmall font-semibold flex text-q_tertiairy ">
        <IconBook className=" fill-q_tertiairy" />
        {request.book.title}
      </div>
      <p>{request.owner.username}</p>
      <p>Status: {request.status}</p>
      {request.status === "alternative" && (
        <div className="mt-2 space-x-2">
          <p>Alternative Book Offered: {request.alternativeBookTitle}</p>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => handleAlternativeResponse(request.id, "accepted")}
          >
            Accept Alternative
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => handleAlternativeResponse(request.id, "declined")}
          >
            Decline Alternative
          </button>
        </div>
      )}
    </li>
  );
};

export default SentRequestItem;
