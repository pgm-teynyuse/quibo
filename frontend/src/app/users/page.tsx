// pages/users/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingIndicator from "components/Loading/loading";

interface User {
  user_id: number;
  username: string;
  email: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error message:", error.message);
          console.error("Axios error response:", error.response);
        }
      }
    };

    fetchUsers();
  }, []);

  const handleChat = (userId: number) => {
    router.push(`/chat/${userId}`);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container mx-auto ">
      <h1 className="text-titleNormal text-q_primary-100 font-bold mb-1">
        Chat
      </h1>
      <p className="text-label text-q_primary-100 mb-5">
        Laatste conversaties
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.user_id}
            onClick={() => handleChat(user.user_id)}
            className=" bg-white flex items-center p-4 border rounded-xl border-q_primary-100 shadow-sm transition-transform transform hover:scale-105"
          >
            <div className="bg-q_primary-100 w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg">
              {user.username[0]}
            </div>
            <div className="ml-4 text-q_primary-100">
              <h2 className="text-titleSmall font-semibold">{user.username}</h2>
              <p className="text-label">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
