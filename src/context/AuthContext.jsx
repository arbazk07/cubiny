// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────────
// Manages authentication + DCL role enforcement.
// Mirrors MySQL GRANT/REVOKE: each role flag gates page access.
// Iteration 2: replace mock login with real JWT call via authService.
// ─────────────────────────────────────────────────────────────────
import { createContext, useState, useCallback, useMemo } from "react";
import { MOCK_USERS } from "../data/mockData";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Login ──────────────────────────────────────────────────────
  // Iteration 2: replace body with:
  //   const res = await authService.login(email, password);
  //   setUser(res.data.user);
  //   localStorage.setItem('token', res.data.token);
  const login = useCallback(async (role) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const userData = MOCK_USERS[role];
      if (!userData) throw new Error("Invalid credentials");
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────
  // Iteration 2: also clear localStorage token + axios default headers
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  // ── DCL Role Flags ─────────────────────────────────────────────
  // These mirror: GRANT SELECT ON rides TO rider_role;
  //               GRANT ALL ON * TO admin_role; etc.
  const isRider  = user?.role === "rider";
  const isDriver = user?.role === "driver";
  const isAdmin  = user?.role === "admin";

  const value = useMemo(
    () => ({ user, loading, error, login, logout, isRider, isDriver, isAdmin }),
    [user, loading, error, login, logout, isRider, isDriver, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
