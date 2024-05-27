import React from "react";
import { useUserData } from "../hooks/useUserData";

const UserProfile = () => {
  const { data: user, isLoading, error } = useUserData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {user.email}</p>
      <p>User ID: {user._id}</p>
    </div>
  );
};

export default UserProfile;
