import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API_KEY = process.env.REACT_APP_API_KEY || "YOU_SHOULD_CHANGE_THIS_TOO";

if (!API_URL || !API_KEY) {
  throw new Error(
    "API_URL or API_KEY is not defined. Please check your environment variables."
  );
}

// Function to fetch user data
const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/auth/user`, {
    headers: {
      "x-api-key": API_KEY,
      "x-auth-token": token,
    },
  });
  return response.data;
};

// Hook to use the fetchUserData function
export const useUserData = () => {
  return useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    onError: (error) => {
      console.error("Error fetching user data:", error);
    },
  });
};
