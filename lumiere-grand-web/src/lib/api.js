import axios from "axios";

// Set VITE_API_URL in .env (see .env.example) to your backend's URL once
// deployed. Falling back to localhost keeps local development simple.
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lg_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("lg_token");
      localStorage.removeItem("lg_user");
    }
    return Promise.reject(err);
  }
);

export function errorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.error || fallback;
}
