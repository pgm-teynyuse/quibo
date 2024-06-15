"use client";
import AddBook from "../../components/Add/AddBook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import LoadingIndicator from "../../components/Loading/loading";

const AddBookPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/api/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setLoading(false);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Token verification failed", error);
        router.push("/login");
      }
    };

    verifyToken();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <AddBook />
    </div>
  );
};

export default AddBookPage;
