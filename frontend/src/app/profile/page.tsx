"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";
import LoadingIndicator from "components/Loading/loading";
import axios from "axios";

const Profile = () => {
  const router = useRouter();
  const { user } = useUser();
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
    window.location.reload(); // Refresh the page
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user?.email}</p>
      <button className="text-red-500" onClick={handleLogout}>Uitloggen</button>
    </div>
  );
};

export default Profile;
