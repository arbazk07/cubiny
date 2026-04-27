// src/pages/Auth/LoginForm.jsx  —  Cubiny v2
// Now calls mockService.login() via AuthContext
import { useState }           from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth }            from "../../hooks/useAuth";
import { Button }             from "../../components/ui/Button";
import { Input }              from "../../components/ui/Input";

export function LoginForm({ role }) {
  const { login, loading, error } = useAuth();
  const [mode,   setMode]   = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [form,   setForm]   = useState({ name:"", email:"", password:"" });
  const upd = f => e => setForm(p=>({...p,[f]:e.target.value}));

  return (
    <form onSubmit={e=>{e.preventDefault();login(role);}} style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {mode==="signup" && (
        <Input label="Full Name" icon={User} placeholder="Your full name" value={form.name} onChange={upd("name")}/>
      )}
      <Input label="Email" icon={Mail} type="email" placeholder={`${role}@cubiny.pk`} value={form.email} onChange={upd("email")}/>
      <Input label="Password" icon={Lock} type={showPw?"text":"password"} placeholder="••••••••"
        value={form.password} onChange={upd("password")}
        iconRight={showPw?EyeOff:Eye} onIconRightClick={()=>setShowPw(p=>!p)}
        hint={mode==="login"?"Forgot password?":undefined}
      />

      {error && (
        <div style={{ background:"rgba(244,63,94,0.1)", border:"1px solid rgba(244,63,94,0.3)", borderRadius:"var(--r1)", padding:"10px 14px", fontSize:13, color:"#fb7185" }}>
          {error}
        </div>
      )}

      <Button type="submit" fullWidth loading={loading} size="lg" style={{ marginTop:4 }}>
        {mode==="login" ? "Sign In to Cubiny" : "Create Account"}
      </Button>

      <div style={{ textAlign:"center", fontSize:12, color:"var(--t4)", paddingTop:4 }}>
        {mode==="login" ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={()=>setMode(m=>m==="login"?"signup":"login")}
          style={{ background:"none", border:"none", color:"var(--v3)", fontWeight:600, fontSize:12, cursor:"pointer" }}>
          {mode==="login" ? "Sign Up" : "Log In"}
        </button>
      </div>

      <div style={{ height:1, background:"linear-gradient(90deg,transparent,var(--b2),transparent)", margin:"4px 0" }}/>
      <p style={{ textAlign:"center", fontSize:11, color:"var(--t4)" }}>
        Demo: click Sign In with any credentials
      </p>
    </form>
  );
}
