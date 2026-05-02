// src/context/AuthContext.jsx — Cubiny v5
// FIX #1: Session restored from localStorage on init (was null on every reload)
// FIX #2: Error state cleared on each new login attempt
import { createContext, useState, useCallback, useMemo } from "react";
import { login as svcLogin, logout as svcLogout } from "../services/mockService";

export const AuthContext = createContext(null);

// ── Bug Fix: restore session from localStorage on cold start ──────────────────
function restoreUser() {
  try {
    const raw = localStorage.getItem("cubiny_user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    // Validate the shape before trusting it
    if (u?.role && u?.id && u?.name) return u;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(restoreUser);   // ← FIX: was useState(null)
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const login = useCallback(async (role, email, password) => {
    setLoading(true);
    setError(null);                                        // clear previous errors
    try {
      const { user: u, token } = await svcLogin(role, email, password);
      localStorage.setItem("cubiny_token", token);
      localStorage.setItem("cubiny_user",  JSON.stringify(u));
      setUser(u);
    } catch (err) {
      setError(err.message ?? "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await svcLogout(); } catch (_) {}
    localStorage.removeItem("cubiny_token");
    localStorage.removeItem("cubiny_user");
    setUser(null);
    setError(null);
  }, []);

  const isRider  = user?.role === "rider";
  const isDriver = user?.role === "driver";
  const isAdmin  = user?.role === "admin";

  const value = useMemo(
    () => ({ user, loading, error, login, logout, isRider, isDriver, isAdmin }),
    [user, loading, error, login, logout, isRider, isDriver, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
