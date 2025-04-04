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
    message: "/auth/message",
    verify: "/auth/verify",
    me: "/users/me/profile",
  },
  worldcoin: {
    nonce: "/worldcoin/nonce",
    verify: "/worldcoin/complete-siwe",
    confirmPayment: "/worldcoin/confirm-payment",
  },
} as const;
