import axiosInstance from "./axiosInstance";

export const login = async ({ email, password }) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await axiosInstance.post("/auth/register", {
    email,
    password,
  });
  return response.data;
};
