// src/services/api.js — Cubiny v5
// BUG FIX: Added response interceptor to parse API error messages uniformly.
// BUG FIX: 401 auto-logout prevents ghost sessions after token expiry.
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Request: attach JWT ────────────────────────────────────────────────────────
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("cubiny_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ── Response: normalize errors ─────────────────────────────────────────────────
api.interceptors.response.use(
  res => res,
  err => {
    const status  = err.response?.status;
    const message = err.response?.data?.message ?? err.message ?? "An error occurred";

    // Auto-clear stale session on 401
    if (status === 401) {
      localStorage.removeItem("cubiny_token");
      localStorage.removeItem("cubiny_user");
      window.location.reload();
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
