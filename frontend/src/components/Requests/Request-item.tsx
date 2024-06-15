import React from "react";
import { RequestItemProps } from "../../app/types/types";
import { IconSwap, IconBook } from "../Icon/Icon";



const RequestItem = ({
  request,
  handleAccept,
  handleDecline,
  handleAcceptAlternative,
  requesterSwapShelf,
}: RequestItemProps ) => {
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
      <p className="mb-4">{request.status}</p>
      {request.status === "pending" && (
        <div className="space-x-2">
          <button
            className="px-4 py-2 bg-q_primary-100 text-white rounded"
            onClick={() => handleAccept(request.id)}
          >
            Accepteren
          </button>
          <button
            className="px-4 py-2 border border-red-500 text-red-500 rounded"
            onClick={() => handleDecline(request.id, request.requester.user_id)}
          >
            Afwijzen
          </button>
        </div>
      )}
      {request.status === "declined" && (
        <div className="mt-2">
          <select
            className="p-2 border rounded"
            onChange={(e) =>
              handleAcceptAlternative(request.id, Number(e.target.value))
            }
          >
            <option value="">Selecteer een alternative boek</option>
            {requesterSwapShelf.map((book) => (
              <option key={book.id} value={book.id}>
                {book.book.title}
              </option>
            ))}
          </select>
        </div>
      )}
    </li>
  );
};

export default RequestItem;
