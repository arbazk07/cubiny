// src/services/api.js
// ─────────────────────────────────────────────────────────────────
// Axios instance pre-configured for the Cubiny Node.js/MySQL backend.
// Iteration 3: set VITE_API_URL in .env to your actual server.
//
// Features:
//   • JWT Bearer token injection on every request
//   • 401 interceptor → auto logout + redirect to /auth
//   • Centralised error normalisation
//   • Request/response logging in development
// ─────────────────────────────────────────────────────────────────
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TIMEOUT  = 12_000; // 12 s

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cubiny_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (import.meta.env.DEV) {
      console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: normalise errors ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message ?? error.message ?? "Unknown error";

    if (status === 401) {
      // Token expired — clear auth and hard-reload to login
      localStorage.removeItem("cubiny_token");
      localStorage.removeItem("cubiny_user");
      window.location.href = "/";
    }

    if (import.meta.env.DEV) {
      console.error(`[API Error] ${status} — ${message}`);
    }

    return Promise.reject({ status, message, raw: error });
  },
);

export default api;
