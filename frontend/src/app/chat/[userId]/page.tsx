"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";
import jwt from "jsonwebtoken";
import LoadingIndicator from "components/Loading/loading";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}
const socket = io(apiUrl);

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  sender?: { username: string };
  receiver?: { username: string };
}

const ChatPage = ({ params }: { params: { userId: string } }) => {
  const router = useRouter();
  const userId = params.userId ?? "";
  const [isConnected, setIsConnected] = useState(false);
  const [newChat, setNewChat] = useState<Message | null>(null);
  const [chats, setChats] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

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

          const response = await axios.get(`${apiUrl}/api/messages/${userId}`, {
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${apiUrl}/api/messages`,
        {
          receiverId: parseInt(userId, 10),
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

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className=" absolute bottom-0 border-q_primary-100">
      <div
        className=" h-96 overflow-y-auto flex flex-col space-y-4"
        ref={chatContainerRef}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex ${
              chat.senderId === parseInt(userId) ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs ${
                chat.senderId === parseInt(userId)
                  ? "bg-white text-q_primary-100"
                  : "bg-white text-q_primary-100"
              }`}
            >
              {chat.content}
              <br />
              <small className="text-label text-q_primary-100">
                {new Date(chat.timestamp).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-4 mb-4">
        <textarea
          className="flex-grow p-2 border border-gray-300 rounded-md mr-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        ></textarea>
        <button
          type="submit"
          onClick={handleSendMessage}
          disabled={!message.trim() || !isConnected}
          className="bg-q_primary-100 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
        >
          Verzend
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
