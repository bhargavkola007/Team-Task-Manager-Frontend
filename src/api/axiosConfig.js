import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
 baseURL:
  import.meta.env.VITE_API_BASE_URL ||
  "https://team-task-manager-backend-production.up.railway.app/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.error("Session expired. Please login again.");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;
