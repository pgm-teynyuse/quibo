"use client";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";
import jwt from "jsonwebtoken";

const socket = io("http://localhost:3000"); // Connect to the backend server

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  sender?: { username: string }; // Mark as optional
  receiver?: { username: string }; // Mark as optional
}

const ChatPage = ({ params }: { params: { userId: string } }) => {
  const router = useRouter();
  const userId = params.userId;
  const [isConnected, setIsConnected] = useState(false);
  const [newChat, setNewChat] = useState<Message | null>(null);
  const [chats, setChats] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("Socket disconnected:", socket.id, "Reason:", reason);
    });

    socket.on("newMessage", (newMessage: Message) => {
      setNewChat(newMessage);
      console.log("New message received:", newMessage);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newMessage");
      socket.off("connect_error");
    };
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No token found");
          const decoded: any = jwt.decode(token);
          const currentUserId = decoded.userId;

          const response = await axios.get(`/api/messages/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setChats(response.data);
          socket.emit("joinRoom", currentUserId, userId);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [userId]);

  useEffect(() => {
    if (newChat) {
      setChats((prevChats) => [...prevChats, newChat]);
    }
  }, [newChat]);

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/messages",
        {
          receiverId: parseInt(userId, 10), // Ensure receiverId is an integer
          content: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {chats.map((chat) => (
          <div key={chat.id}>
            <strong>{chat.sender?.username ?? "Unknown"}:</strong>{" "}
            {chat.content}
            <br />
            <small>{new Date(chat.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        ></textarea>
        <button
          type="submit"
          onClick={handleSendMessage}
          disabled={!message.trim() || !isConnected}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
