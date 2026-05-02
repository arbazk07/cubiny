// src/services/api.js  —  Cubiny Iteration 3
// ─────────────────────────────────────────────────────────────────
// Axios instance wired to the real Node.js/MySQL backend.
// Set VITE_API_URL in .env to your backend URL.
// ─────────────────────────────────────────────────────────────────
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const api = axios.create({
  baseURL:  BASE_URL,
  timeout:  12_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach JWT ───────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cubiny_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (import.meta.env.DEV) {
      console.debug(`[API →] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (err) => Promise.reject(err),
);

// ── Response: normalise errors + auto-logout on 401 ──────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status;
    const message = err.response?.data?.message ?? err.message ?? "Unknown error";

    if (status === 401) {
      localStorage.removeItem("cubiny_token");
      localStorage.removeItem("cubiny_user");
      window.location.href = "/";
    }

    if (import.meta.env.DEV) {
      console.error(`[API ✗] ${status} — ${message}`);
    }

    return Promise.reject({ status, message, raw: err });
  },
);

export default api;
