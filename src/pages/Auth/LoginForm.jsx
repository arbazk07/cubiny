// src/pages/Auth/LoginForm.jsx — Cubiny v6
// All v5 bug fixes retained: strict validation, no bypass possible
import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth }  from '../../hooks/useAuth';
import { Button }   from '../../components/ui/Button';
import { Input }    from '../../components/ui/Input';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

function validate(mode, form) {
  const e = {};
  if (mode === 'signup' && !form.name.trim()) e.name = 'Full name is required';
  if (!form.email.trim())                     e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email';
  if (!form.password)            e.password = 'Password is required';
  else if (form.password.length < 6) e.password = 'At least 6 characters required';
  return e;
}

export function LoginForm({ role }) {
  const { login, loading, error } = useAuth();
  const [mode,   setMode]   = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [fe,     setFe]     = useState({});
  const [form,   setForm]   = useState({ name:'', email:'', password:'' });

  const upd = field => e => {
    setForm(p => ({ ...p, [field]:e.target.value }));
    if (fe[field]) setFe(p => ({ ...p, [field]:undefined }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate(mode, form);
    if (Object.keys(errs).length) { setFe(errs); return; }
    setFe({});
    await login(role, form.email.trim(), form.password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }} noValidate>
      {mode === 'signup' && (
        <Input label="Full Name" icon={User} placeholder="Your full name" value={form.name} onChange={upd('name')} error={fe.name}/>
      )}
      <Input label="Email Address" icon={Mail} type="email" placeholder={`${role}@cubiny.pk`} value={form.email} onChange={upd('email')} error={fe.email}/>
      <Input
        label="Password" icon={Lock} type={showPw?'text':'password'} placeholder="Min. 6 characters"
        value={form.password} onChange={upd('password')} error={fe.password}
        iconRight={showPw?EyeOff:Eye} onIconRightClick={()=>setShowPw(p=>!p)}
        hint={mode==='login' ? 'Forgot password?' : undefined}
      />

      {error && (
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'var(--r-lg)', padding:'12px 14px', fontSize:13, color:'#DC2626' }}>
          <AlertCircle size={14} style={{ flexShrink:0 }}/> {error}
        </div>
      )}

      <Button type="submit" variant="primary" fullWidth loading={loading} size="lg" style={{ marginTop:4 }}>
        {mode==='login' ? `Sign In as ${role.charAt(0).toUpperCase()+role.slice(1)}` : 'Create Account'}
      </Button>

      <p style={{ textAlign:'center', fontSize:13, color:'var(--text-muted)' }}>
        {mode==='login' ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={()=>{setMode(m=>m==='login'?'signup':'login');setFe({});}}
          style={{ background:'none', border:'none', color:'var(--cobalt)', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'var(--font)' }}>
          {mode==='login' ? 'Sign Up' : 'Sign In'}
        </button>
      </p>

      {USE_MOCK && (
        <p style={{ textAlign:'center', fontSize:11, color:'var(--text-muted)', background:'var(--bg-subtle)', borderRadius:'var(--r-md)', padding:'8px 12px', lineHeight:1.6 }}>
          Demo mode · Any email + 6-char password works
        </p>
      )}
    </form>
  );
}
