import axios from "axios";

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )
);

export default axiosInstance;

export const endpoints = {
  auth: {
    login: "/v1/auth/admin-login",
    me: "/v1/auth/me",
  },
} as const;
