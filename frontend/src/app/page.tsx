"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SearchBooks from "../components/Search/searchBooks";
import { useUser } from "../contexts/UserContext";
import React from "react";

const Home = () => {
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
        const response = await axios.get(
          "http://localhost:3000/api/verify-token",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    return <p>Loading...</p>;
  }

  return (
    <main className="">
      <h1>Welkom op de Home-pagina</h1>
      <button onClick={handleLogout}>Uitloggen</button>
      <SearchBooks />

    </main>
  );
};

export default Home;
