"use client";
import { useContext, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";
import LoadingIndicator from "components/Loading/loading";

const Profile = () => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  console.log(user?.userId);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (loading) {
    return <LoadingIndicator />;
  }

  return <div>
    <h1>Profile</h1>
    <p>Welcome, {user?.email}</p>
    <p></p>
  </div>;
}


export default Profile;
