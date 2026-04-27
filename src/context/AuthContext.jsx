// src/context/AuthContext.jsx  —  Cubiny v2
// Iteration 2: login/logout now go through mockService (async).
// Iteration 3: mockService.login → api.post('/auth/login', { email, password })
import { createContext, useState, useCallback, useMemo } from "react";
import { login as svcLogin, logout as svcLogout } from "../services/mockService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const login = useCallback(async (role) => {
    setLoading(true); setError(null);
    try {
      const { user: u, token } = await svcLogin(role);
      // Persist token for api.js interceptor
      localStorage.setItem("cubiny_token", token);
      localStorage.setItem("cubiny_user",  JSON.stringify(u));
      setUser(u);
    } catch (err) {
      setError(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await svcLogout();
    localStorage.removeItem("cubiny_token");
    localStorage.removeItem("cubiny_user");
    setUser(null); setError(null);
  }, []);

  // DCL flags — mirror MySQL GRANT/REVOKE per role
  const isRider  = user?.role === "rider";
  const isDriver = user?.role === "driver";
  const isAdmin  = user?.role === "admin";

  const value = useMemo(
    () => ({ user, loading, error, login, logout, isRider, isDriver, isAdmin }),
    [user, loading, error, login, logout, isRider, isDriver, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
