// src/pages/Auth/LoginForm.jsx — Cubiny v5
// BUG FIX: Strict form validation — user can NO LONGER bypass auth without credentials
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button }  from "../../components/ui/Button";
import { Input }   from "../../components/ui/Input";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const DEMO_CREDS = {
  rider:  { email: "aisha@cubiny.pk",  password: "cubiny123" },
  driver: { email: "hassan@cubiny.pk", password: "cubiny123" },
  admin:  { email: "admin@cubiny.pk",  password: "cubiny123" },
};

// ── Validation helpers ─────────────────────────────────────────────────────────
function validate(mode, form) {
  const errs = {};
  if (mode === "signup" && !form.name.trim())
    errs.name = "Full name is required";

  if (!form.email.trim())
    errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errs.email = "Please enter a valid email address";

  if (!form.password)
    errs.password = "Password is required";
  else if (form.password.length < 6)
    errs.password = "Password must be at least 6 characters";

  return errs;
}

export function LoginForm({ role }) {
  const { login, loading, error } = useAuth();
  const [mode,   setMode]   = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Pre-fill demo creds only in non-mock (real API) mode
  const [form, setForm] = useState({
    name:     "",
    email:    USE_MOCK ? "" : (DEMO_CREDS[role]?.email    ?? ""),
    password: USE_MOCK ? "" : (DEMO_CREDS[role]?.password ?? ""),
  });

  const upd = field => e => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    // Clear individual field error on change
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // ── BUG FIX: validate BEFORE calling login ────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate(mode, form);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;                     // ← hard stop; login() never called
    }
    setFieldErrors({});
    await login(role, form.email.trim(), form.password);
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "signup" : "login");
    setFieldErrors({});
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }} noValidate>
      {mode === "signup" && (
        <Input
          label="Full Name" icon={User} placeholder="Your full name"
          value={form.name} onChange={upd("name")} error={fieldErrors.name}
        />
      )}

      <Input
        label="Email" icon={Mail} type="email"
        placeholder={`${role}@cubiny.pk`}
        value={form.email} onChange={upd("email")} error={fieldErrors.email}
      />

      <Input
        label="Password" icon={Lock}
        type={showPw ? "text" : "password"} placeholder="••••••••"
        value={form.password} onChange={upd("password")} error={fieldErrors.password}
        iconRight={showPw ? EyeOff : Eye}
        onIconRightClick={() => setShowPw(p => !p)}
        hint={mode === "login" ? "Forgot password?" : undefined}
      />

      {/* API / auth error (from backend or mock) */}
      {error && (
        <div style={{
          display:"flex", alignItems:"center", gap:10,
          background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.28)",
          borderRadius:"var(--r2)", padding:"11px 14px", fontSize:13, color:"#fb7185",
        }}>
          <AlertCircle size={14} style={{ flexShrink:0 }}/>
          {error}
        </div>
      )}

      {!USE_MOCK && (
        <p style={{ fontSize:11, color:"var(--t3)", lineHeight:1.6 }}>
          Demo credentials pre-filled. Run{" "}
          <code style={{ fontFamily:"var(--font-m)", color:"var(--blu2)" }}>node sql/seed.js</code>
          {" "}to create them in your DB.
        </p>
      )}

      <Button type="submit" fullWidth loading={loading} size="lg" style={{ marginTop:4 }}>
        {mode === "login" ? "Sign In to Cubiny" : "Create Account"}
      </Button>

      <div style={{ textAlign:"center", fontSize:12, color:"var(--t3)", paddingTop:4 }}>
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button" onClick={switchMode}
          style={{ background:"none", border:"none", color:"var(--blu2)", fontWeight:700, fontSize:12, cursor:"pointer" }}>
          {mode === "login" ? "Sign Up" : "Log In"}
        </button>
      </div>

      <div style={{ height:1, background:"linear-gradient(90deg,transparent,var(--b2),transparent)", margin:"4px 0" }} />
      <p style={{ textAlign:"center", fontSize:11, color:"var(--t4)" }}>
        {USE_MOCK ? "Mock mode — enter any email & password (6+ chars)" : "Connected to Aiven MySQL backend"}
      </p>
    </form>
  );
}
