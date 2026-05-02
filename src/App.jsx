// src/App.jsx — Cubiny Desktop v4
import { useAuth }  from "./hooks/useAuth";
import { AppShell } from "./components/layout/AppShell";
import { AuthPage } from "./pages/Auth/AuthPage";

export default function App() {
  const { user } = useAuth();
  return user ? <AppShell/> : <AuthPage/>;
}
