import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/";

const API_KEY = process.env.REACT_APP_API_KEY || "YOU_SHOULD_CHANGE_THIS_TOO";

if (!API_URL || !API_KEY) {
  throw new Error(
    "API_URL or API_KEY is not defined. Please check your environment variables."
  );
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-key": API_KEY,
  },
});

export default axiosInstance;
