// src/hooks/useAuth.js — Cubiny v5
// BUG FIX: Gracefully handles context being null (if used outside AuthProvider)
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>. Check your component tree.");
  }
  return ctx;
}
