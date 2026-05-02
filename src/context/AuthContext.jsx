// src/context/AuthContext.jsx  —  Cubiny Iteration 3
// Login now passes real email + password to the backend.
// Falls back to mock mode when VITE_USE_MOCK=true.
import { createContext, useState, useCallback, useMemo } from "react";
import { login as svcLogin, logout as svcLogout } from "../services/mockService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const login = useCallback(async (role, email, password) => {
    setLoading(true); setError(null);
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
    setUser(null); setError(null);
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
