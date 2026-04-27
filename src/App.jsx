// src/App.jsx
import { useAuth }  from "./hooks/useAuth";
import { AppShell } from "./components/layout/AppShell";
import { AuthPage } from "./pages/Auth/AuthPage";

export default function App() {
  const { user } = useAuth();
  return user ? <AppShell /> : <AuthPage />;
}
