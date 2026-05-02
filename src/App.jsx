// src/App.jsx — Cubiny v5
// Adds React Error Boundary to catch render crashes gracefully
import { Component } from "react";
import { useAuth }   from "./hooks/useAuth";
import { AppShell }  from "./components/layout/AppShell";
import { AuthPage }  from "./pages/Auth/AuthPage";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(err, info) { console.error("[Cubiny ErrorBoundary]", err, info); }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        height:"100vh", gap:16, background:"var(--bg)", color:"var(--t1)",
      }}>
        <div style={{ fontSize:48 }}>⚠️</div>
        <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, color:"var(--t1)" }}>
          Something went wrong
        </h2>
        <p style={{ fontSize:13, color:"var(--t3)", maxWidth:380, textAlign:"center" }}>
          {this.state.error?.message ?? "An unexpected error occurred."}
        </p>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          style={{
            marginTop:8, padding:"10px 24px", borderRadius:"var(--r2)",
            background:"linear-gradient(135deg,var(--blu),var(--v2))",
            border:"none", color:"#fff", fontFamily:"var(--font-b)", fontSize:14, cursor:"pointer",
          }}>
          Try Again
        </button>
      </div>
    );
  }
}

function Router() {
  const { user } = useAuth();
  return user ? <AppShell /> : <AuthPage />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}
