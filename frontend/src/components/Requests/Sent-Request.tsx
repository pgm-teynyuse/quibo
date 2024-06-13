import React from "react";
import { RequestItemProps } from "../../app/types/types";

const SentRequestItem = ({ request, handleAlternativeResponse }: RequestItemProps) => {
  return (
    <li className="p-4 border rounded mb-4">
      <h2 className="text-lg font-semibold">
        {request.requestedBook.title}
      </h2>
      <p>Offered Book: {request.book.title}</p>
      <p>Owner: {request.owner.email}</p>
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
