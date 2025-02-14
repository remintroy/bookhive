import axios from "axios";
import { auth } from "./firebase";

const server = axios.create({ baseURL: "/", withCredentials: true });

let tokenPromise = () =>
  new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        resolve(token);
      } else {
        resolve(null);
      }
      unsubscribe(); // Unsubscribe after the first execution
    });
  });

server.interceptors.request.use(async (config) => {
  const token = await tokenPromise(); // Ensure the token is ready
  if (!token && auth.currentUser) {
    tokenPromise = auth.currentUser.getIdToken; // Refresh token if needed
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default server;
