"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import RequestItem from "../../components/Requests/Request-item";
import SentRequestItem from "../../components/Requests/Sent-Request";

const Requests: React.FC = () => {
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [requesterSwapShelf, setRequesterSwapShelf] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    fetchReceivedRequests();
    fetchSentRequests();
  }, [user]);

  const fetchReceivedRequests = async () => {
    if (!user) return;
    try {
      const response = await axios.get<any[]>(
        "http://localhost:3000/received-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReceivedRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching received requests:", error);
    }
  };

  const fetchSentRequests = async () => {
    if (!user) return;
    try {
      const response = await axios.get<any[]>(
        "http://localhost:3000/sent-requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSentRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/swap-request/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Swap request accepted:", response.data);
      setReceivedRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: "accepted" } : request
        )
      );
    } catch (error) {
      console.error("Error accepting swap request:", error);
    }
  };

  const handleDecline = async (id: number, requesterId: number) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/swap-request/${id}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Swap request declined:", response.data);
      setReceivedRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: "declined" } : request
        )
      );

      // Fetch the requester's swap shelf
      const shelfResponse = await axios.get(
        `http://localhost:3000/user/${requesterId}/swap-shelf`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRequesterSwapShelf(shelfResponse.data);
    } catch (error) {
      console.error("Error declining swap request:", error);
    }
  };

  const handleAcceptAlternative = async (
    id: number,
    alternativeBookId: number
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/swap-request/${id}/alternative`,
        { alternativeBookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Alternative swap request created:", response.data);
      await fetchReceivedRequests();
    } catch (error) {
      console.error("Error creating alternative swap request:", error);
    }
  };

  const handleAlternativeResponse = async (id: number, status: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/swap-request/${id}/alternative-response`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Alternative swap request response:", response.data);
      setSentRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? { ...request, alternativeStatus: status }
            : request
        )
      );
    } catch (error) {
      console.error("Error responding to alternative swap request:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-titleNormal text-q_primary-100 font-semibold mb-4">Received Requests</h1>
      </div>

      {receivedRequests.length === 0 ? (
        <p>No received requests.</p>
      ) : (
        <ul>
          {receivedRequests.map((request) => (
            <RequestItem
              key={request.id}
              request={request}
              handleAccept={handleAccept}
              handleDecline={handleDecline}
              handleAcceptAlternative={handleAcceptAlternative}
              requesterSwapShelf={requesterSwapShelf} handleAlternativeResponse={function (id: number, response: string): void {
                throw new Error("Function not implemented.");
              } }            />
          ))}
        </ul>
      )}

      <div className="mt-10">
        <h1 className="text-2xl font-bold mb-4">Sent Requests</h1>
        {sentRequests.length === 0 ? (
          <p>No sent requests.</p>
        ) : (
          <ul>
            {sentRequests.map((request) => (
              <SentRequestItem
                key={request.id}
                request={request}
                handleAlternativeResponse={handleAlternativeResponse} handleAccept={function (id: number): void {
                  throw new Error("Function not implemented.");
                } } handleDecline={function (id: number, userId: number): void {
                  throw new Error("Function not implemented.");
                } } handleAcceptAlternative={function (id: number, bookId: number): void {
                  throw new Error("Function not implemented.");
                } } requesterSwapShelf={[]}              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Requests;
