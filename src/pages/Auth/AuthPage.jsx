// src/pages/Auth/AuthPage.jsx — Cubiny v6
// Split: Landing page (public) vs Login card — both clean light theme
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { Button }    from '../../components/ui/Button';
import {
  Shield, Zap, Star, MapPin, ArrowRight,
  CheckCircle, Users, TrendingUp, Clock,
} from 'lucide-react';

/* ─── Logo ─────────────────────────────────────────────────────────────── */
function Logo({ size=28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2"  y="2"  width="9" height="9" rx="2" fill="#22C55E"/>
      <rect x="13" y="2"  width="9" height="9" rx="2" fill="#22C55E" opacity="0.4"/>
      <rect x="2"  y="13" width="9" height="9" rx="2" fill="#22C55E" opacity="0.4"/>
      <rect x="13" y="13" width="9" height="9" rx="2" fill="#22C55E"/>
    </svg>
  );
}

/* ─── STATS STRIP ───────────────────────────────────────────────────────── */
const STATS = [
  { value:'8,900+', label:'Active Riders',     icon:Users },
  { value:'1,240',  label:'Verified Drivers',  icon:Shield },
  { value:'94K+',   label:'Total Rides',       icon:TrendingUp },
  { value:'4.8★',   label:'Avg. Rating',       icon:Star },
];

/* ─── FEATURE ROWS ──────────────────────────────────────────────────────── */
const FEATURES = [
  { icon:Zap,     color:'#22C55E', bg:'#F0FDF4', title:'Instant Matching',       desc:'Driver confirmed in under 60 seconds, guaranteed.' },
  { icon:Shield,  color:'#2563EB', bg:'#EFF6FF', title:'Verified Drivers Only',  desc:'Background checks, CNIC verification, and live ratings.' },
  { icon:MapPin,  color:'#F59E0B', bg:'#FFFBEB', title:'Live GPS Tracking',      desc:'Track every ride in real-time. Share with family instantly.' },
  { icon:Clock,   color:'#0EA5E9', bg:'#F0F9FF', title:'Transparent Fares',      desc:'See the price before you book. No surge surprises.' },
];

/* ─── TESTIMONIALS ──────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { name:'Aisha M.',  city:'Islamabad', text:'Best ride app in Pakistan — clean cars, honest drivers, and the app actually works!', stars:5 },
  { name:'Bilal A.',  city:'Rawalpindi', text:'Switched from another app and never looked back. Fares are fair and drivers are professional.', stars:5 },
  { name:'Sara K.',   city:'Lahore',    text:'Real-time tracking gives me peace of mind every single ride.', stars:5 },
];

/* ─── LOGIN CARD ────────────────────────────────────────────────────────── */
function LoginCard({ onBack }) {
  const [tab, setTab] = useState('rider');
  const TABS = ['rider','driver','admin'];
  return (
    <div style={{
      minHeight:'100vh', background:'var(--bg)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'32px 16px', position:'relative',
    }}>
      {/* Subtle green tint top */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'35%', background:'linear-gradient(180deg,rgba(34,197,94,0.04),transparent)', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:420 }} className="anim-fade-up">
        {/* Back to landing */}
        <button onClick={onBack} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', gap:6, marginBottom:28, fontFamily:'var(--font)', fontWeight:500 }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}
        >
          ← Back to home
        </button>

        {/* Logo + header */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:14 }}>
            <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:14, boxShadow:'var(--shadow-md)' }}>
              <Logo size={32}/>
            </div>
          </div>
          <h1 style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em', marginBottom:4 }}>
            Welcome to Cubiny
          </h1>
          <p style={{ fontSize:14, color:'var(--text-muted)' }}>
            Pakistan's most trusted ride-hailing platform
          </p>
        </div>

        {/* Role tabs */}
        <div style={{ display:'flex', background:'var(--bg-subtle)', borderRadius:'var(--r-lg)', padding:3, marginBottom:20, border:'1px solid var(--border)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex:1, padding:'9px 0',
              borderRadius:'var(--r-md)',
              border:'none', cursor:'pointer',
              background: tab===t ? 'white' : 'transparent',
              color: tab===t ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: tab===t ? 700 : 400,
              fontSize:13, fontFamily:'var(--font)',
              boxShadow: tab===t ? 'var(--shadow-xs)' : 'none',
              transition:'all 0.15s',
            }}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>

        {/* Login card */}
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-2xl)', padding:'28px 28px', boxShadow:'var(--shadow-lg)' }}>
          <LoginForm role={tab} key={tab}/>
        </div>

        <p style={{ textAlign:'center', fontSize:11, color:'var(--text-muted)', marginTop:20 }}>
          © 2026 Cubiny Technologies · Privacy Policy · Terms of Service
        </p>
      </div>
    </div>
  );
}

/* ─── LANDING PAGE ──────────────────────────────────────────────────────── */
function LandingPage({ onLogin }) {
  return (
    <div style={{ minHeight:'100vh', background:'white', overflowY:'auto', fontFamily:'var(--font)' }}>

      {/* ── NAV ── */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(255,255,255,0.92)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid var(--border)',
        padding:'0 48px', height:60,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Logo size={22}/>
          <span style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Cubiny</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={onLogin} style={{ background:'none', border:'none', fontSize:14, color:'var(--text-secondary)', cursor:'pointer', fontWeight:500, padding:'8px 16px', borderRadius:'var(--r-lg)', fontFamily:'var(--font)', transition:'background 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-subtle)'}
            onMouseLeave={e=>e.currentTarget.style.background='none'}
          >
            Sign In
          </button>
          <Button variant="primary" size="sm" onClick={onLogin}>
            Get Started <ArrowRight size={13}/>
          </Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        padding:'80px 48px 72px',
        background:'linear-gradient(180deg,rgba(34,197,94,0.04) 0%,white 60%)',
        textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-60, left:'10%', width:300, height:300, borderRadius:'50%', background:'rgba(34,197,94,0.06)', filter:'blur(40px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:-40, right:'8%', width:240, height:240, borderRadius:'50%', background:'rgba(37,99,235,0.05)', filter:'blur(40px)', pointerEvents:'none' }}/>

        {/* Trust badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--green-lt)', border:'1px solid var(--green-mid)', borderRadius:99, padding:'6px 16px', marginBottom:24, fontSize:12, fontWeight:700, color:'var(--green-dk)' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', display:'inline-block' }}/>
          Trusted by 8,900+ riders in Islamabad & Rawalpindi
        </div>

        <h1 style={{
          fontSize:'clamp(36px,5vw,62px)', fontWeight:900,
          color:'var(--text-primary)', letterSpacing:'-0.04em',
          lineHeight:1.06, marginBottom:20, maxWidth:700, margin:'0 auto 20px',
        }}>
          Your city, on demand.
          <br/>
          <span style={{ color:'var(--green)' }}>Get there faster.</span>
        </h1>

        <p style={{ fontSize:'clamp(15px,1.5vw,18px)', color:'var(--text-secondary)', lineHeight:1.7, maxWidth:520, margin:'0 auto 36px' }}>
          Cubiny connects you with professional, verified drivers in seconds.
          Transparent pricing, real-time tracking, and zero hidden fees.
        </p>

        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Button variant="primary" size="xl" onClick={onLogin}>
            Book Your First Ride <ArrowRight size={16}/>
          </Button>
          <Button variant="secondary" size="xl" onClick={onLogin}>
            Drive with Cubiny
          </Button>
        </div>

        {/* Social proof strip */}
        <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center', marginTop:28 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:['#DCFCE7','#DBEAFE','#FEF3C7','#F3E8FF','#E0F2FE'][i-1], border:'2px solid white', marginLeft:i>1?-10:0 }}/>
          ))}
          <span style={{ fontSize:13, color:'var(--text-secondary)', fontWeight:500, marginLeft:8 }}>Join 8,900+ happy riders</span>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background:'var(--text-primary)', padding:'32px 48px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:32, maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          {STATS.map(({ value, label, icon:Icon }) => (
            <div key={label}>
              <p style={{ fontSize:'clamp(22px,3vw,32px)', fontWeight:900, color:'white', letterSpacing:'-0.03em', marginBottom:4 }}>{value}</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'72px 48px', background:'var(--bg)' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <p style={{ fontSize:12, fontWeight:700, color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>WHY CUBINY</p>
          <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em', marginBottom:14 }}>
            Built for riders who demand the best
          </h2>
          <p style={{ fontSize:15, color:'var(--text-secondary)', maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>
            Every feature is designed around one goal: getting you where you need to go, safely and on time.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20, maxWidth:1000, margin:'0 auto' }}>
          {FEATURES.map(({ icon:Icon, color, bg, title, desc }) => (
            <div key={title} style={{
              background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)',
              padding:'28px 24px', boxShadow:'var(--shadow-sm)',
              transition:'all 0.2s', cursor:'default',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow='var(--shadow-lg)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.transform='translateY(0)'; }}
            >
              <div style={{ width:48, height:48, borderRadius:'var(--r-lg)', background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={22} color={color} strokeWidth={2}/>
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:8, letterSpacing:'-0.02em' }}>{title}</h3>
              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RIDE TYPES ── */}
      <section style={{ padding:'72px 48px', background:'white' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--cobalt)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>RIDE OPTIONS</p>
            <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Pick your ride type</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[
              { label:'Economy',  price:'From Rs. 100', desc:'Affordable daily commutes',       emoji:'🚗', color:'#22C55E', bg:'#F0FDF4' },
              { label:'Premium',  price:'From Rs. 200', desc:'Comfort sedans & SUVs',            emoji:'🚙', color:'#2563EB', bg:'#EFF6FF' },
              { label:'Bike',     price:'From Rs. 60',  desc:'Beat traffic, fastest option',    emoji:'🏍️', color:'#F59E0B', bg:'#FFFBEB' },
            ].map(({ label, price, desc, emoji, color, bg }) => (
              <div key={label} style={{
                background:bg, border:`1.5px solid ${color}22`,
                borderRadius:'var(--r-xl)', padding:'28px 24px',
                textAlign:'center', cursor:'default',
                transition:'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{ fontSize:36, marginBottom:14 }}>{emoji}</div>
                <h3 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', marginBottom:4 }}>{label}</h3>
                <p style={{ fontSize:13, color:'var(--text-secondary)', marginBottom:10, lineHeight:1.5 }}>{desc}</p>
                <p style={{ fontSize:14, fontWeight:700, color }}>{price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:'72px 48px', background:'var(--bg)' }}>
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <p style={{ fontSize:12, fontWeight:700, color:'var(--green)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:10 }}>REVIEWS</p>
          <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Riders love Cubiny</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20, maxWidth:900, margin:'0 auto' }}>
          {TESTIMONIALS.map(({ name, city, text, stars }) => (
            <div key={name} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'24px', boxShadow:'var(--shadow-sm)' }}>
              <div style={{ display:'flex', gap:2, marginBottom:12 }}>
                {Array.from({length:stars}).map((_,i)=>(
                  <Star key={i} size={14} color="#F59E0B" fill="#F59E0B"/>
                ))}
              </div>
              <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.65, marginBottom:16 }}>"{text}"</p>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{name}</p>
                <p style={{ fontSize:12, color:'var(--text-muted)' }}>{city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section style={{ background:'var(--text-primary)', padding:'64px 48px', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(24px,3.5vw,40px)', fontWeight:900, color:'white', letterSpacing:'-0.03em', marginBottom:14 }}>
          Ready to ride?
        </h2>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', marginBottom:32, maxWidth:400, margin:'0 auto 32px' }}>
          Download the app or book right here. Your first ride is waiting.
        </p>
        <Button variant="primary" size="xl" onClick={onLogin} style={{ margin:'0 auto' }}>
          Book Now — It's Free <ArrowRight size={16}/>
        </Button>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:40 }}>
          © 2026 Cubiny Technologies Ltd. · Islamabad · All Rights Reserved
        </p>
      </section>
    </div>
  );
}

/* ─── ROOT EXPORT ───────────────────────────────────────────────────────── */
export function AuthPage() {
  const [view, setView] = useState('landing'); // 'landing' | 'login'
  if (view === 'login') return <LoginCard onBack={() => setView('landing')}/>;
  return <LandingPage onLogin={() => setView('login')}/>;
}
