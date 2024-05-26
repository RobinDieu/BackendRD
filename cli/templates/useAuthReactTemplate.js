import { useMutation } from "@tanstack/react-query";
import { login, register } from "../api/authAPI";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }) => {
      return login({ email, password });
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ email, password }) => {
      return register(email, password);
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
    },
  });
};
