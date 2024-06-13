"use client";
import { useContext, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const { user } = useUser();
  console.log(user?.userId);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return <div>
    <h1>Profile</h1>
    <p>Welcome, {user?.email}</p>
    <p></p>
  </div>;
}


export default Profile;
