// src/pages/Auth/LoginForm.jsx
import { useState }  from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth }   from "../../hooks/useAuth";
import { Button }    from "../../components/ui/Button";
import { Input }     from "../../components/ui/Input";

export function LoginForm({ role }) {
  const { login, loading, error } = useAuth();
  const [mode,   setMode]   = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [form,   setForm]   = useState({ name: "", email: "", password: "" });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    login(role);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {mode === "signup" && (
        <Input
          label="Full Name"
          placeholder="Your full name"
          value={form.name}
          onChange={update("name")}
        />
      )}

      <Input
        label="Email"
        type="email"
        placeholder={`${role}@example.com`}
        value={form.email}
        onChange={update("email")}
      />

      <Input
        label="Password"
        type={showPw ? "text" : "password"}
        placeholder="••••••••"
        value={form.password}
        onChange={update("password")}
        iconRight={showPw ? EyeOff : Eye}
        onIconRightClick={() => setShowPw((p) => !p)}
      />

      {error && (
        <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>
      )}

      <Button type="submit" fullWidth loading={loading} style={{ marginTop: 8 }}>
        {mode === "login" ? "Sign In" : "Create Account"}
      </Button>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--clr-txt-3)" }}>
        {mode === "login" ? "No account? " : "Have an account? "}
        <button
          type="button"
          onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
          style={{ background: "none", border: "none", color: "var(--clr-violet-3)", fontWeight: 500, fontSize: 13, cursor: "pointer" }}
        >
          {mode === "login" ? "Sign Up" : "Log In"}
        </button>
      </p>
    </form>
  );
}
