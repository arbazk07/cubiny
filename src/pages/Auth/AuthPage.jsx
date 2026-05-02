// src/pages/Auth/AuthPage.jsx — Cubiny v5
// BUG FIX: Layout rebuilt with CSS Grid — no more flex overflow collapse on narrow Electron windows
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { Shield, Zap, Star, MapPin } from "lucide-react";

const FEATURES = [
  { icon: Zap,    color:"var(--blu2)", label:"Surge pricing that's fair & transparent" },
  { icon: Shield, color:"var(--grn2)", label:"Every driver background-verified"         },
  { icon: Star,   color:"var(--amb)",  label:"Rated #1 in Rawalpindi & Islamabad"       },
  { icon: MapPin, color:"var(--v3)",   label:"Live GPS tracking — every single ride"    },
];

function FloatOrb({ x, y, color, size = 180, blur = 60, opacity = 0.12 }) {
  return (
    <div style={{
      position:"absolute", left:`${x}%`, top:`${y}%`,
      width:size, height:size, borderRadius:"50%",
      background:color, filter:`blur(${blur}px)`,
      opacity, pointerEvents:"none", transform:"translate(-50%,-50%)",
    }} />
  );
}

export function AuthPage() {
  const [tab, setTab] = useState("rider");
  const tabs = ["rider","driver","admin"];

  return (
    // ── FIX: use CSS Grid with minmax so columns never collapse on narrow windows ──
    <div style={{
      height:"100vh", display:"grid",
      gridTemplateColumns:"minmax(380px,1fr) minmax(380px,480px)",
      overflow:"hidden", position:"relative",
      background:"var(--bg)",
    }}>
      {/* ── Ambient glow orbs ── */}
      <FloatOrb x={15} y={10} color="#7c3aed" size={280} blur={80} opacity={0.14}/>
      <FloatOrb x={85} y={85} color="#3b82f6" size={240} blur={70} opacity={0.12}/>
      <FloatOrb x={50} y={50} color="#10b981" size={160} blur={90} opacity={0.05}/>

      {/* ── LEFT: Branding panel ── */}
      <div style={{
        display:"flex", flexDirection:"column", justifyContent:"center",
        padding:"60px 72px", borderRight:"1px solid var(--b1)",
        position:"relative", overflow:"hidden",
      }}>
        {/* Faint grid pattern */}
        <svg style={{ position:"absolute", inset:0, opacity:0.04, pointerEvents:"none" }}
          width="100%" height="100%">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#8b5cf6" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        <div style={{ position:"relative", zIndex:1 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:52 }}>
            <div style={{
              background:"linear-gradient(135deg,#7c3aed,#3b82f6)", borderRadius:18,
              padding:13, display:"flex", boxShadow:"0 12px 40px rgba(124,62,237,0.45)",
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <rect x="2"  y="2"  width="9" height="9" rx="2.5" fill="white" opacity="0.95"/>
                <rect x="13" y="2"  width="9" height="9" rx="2.5" fill="white" opacity="0.50"/>
                <rect x="2"  y="13" width="9" height="9" rx="2.5" fill="white" opacity="0.50"/>
                <rect x="13" y="13" width="9" height="9" rx="2.5" fill="white" opacity="0.95"/>
              </svg>
            </div>
            <div>
              <div style={{
                fontFamily:"var(--font-d)", fontWeight:800, fontSize:34,
                background:"linear-gradient(135deg,#a78bfa,#60a5fa)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                letterSpacing:"-0.03em",
              }}>Cubiny</div>
              <div style={{ fontSize:11, color:"var(--t4)", letterSpacing:"0.18em", textTransform:"uppercase" }}>
                Premium Rides
              </div>
            </div>
          </div>

          <h1 style={{
            fontFamily:"var(--font-d)", fontSize:48, fontWeight:800,
            lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:18, maxWidth:400,
          }}>
            Move smarter,<br/>
            <span style={{
              background:"linear-gradient(135deg,var(--blu2),var(--v3),var(--grn2))",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              ride better.
            </span>
          </h1>

          <p style={{ fontSize:15, color:"var(--t2)", lineHeight:1.75, maxWidth:340, marginBottom:44 }}>
            Cubiny connects you with verified drivers instantly. Real-time tracking,
            fair fares, and premium service — every ride, every time.
          </p>

          {/* Feature chips */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {FEATURES.map(({ icon: Icon, color, label }) => (
              <div key={label} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"12px 16px",
                background:"var(--s1)", border:"1px solid var(--b1)",
                borderRadius:"var(--r2)", transition:"all 0.2s",
              }}>
                <div style={{
                  width:32, height:32, borderRadius:10, display:"flex",
                  alignItems:"center", justifyContent:"center",
                  background:"var(--s2)", border:"1px solid var(--b1)",
                }}>
                  <Icon size={14} color={color}/>
                </div>
                <span style={{ fontSize:13, color:"var(--t2)", fontWeight:500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Login panel ── */}
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", padding:"48px 48px",
        position:"relative", overflowY:"auto",
        background:"linear-gradient(180deg, rgba(59,130,246,0.03) 0%, transparent 60%)",
      }}>
        <div style={{ width:"100%", maxWidth:380 }} className="animate-bounce-in">

          <div style={{ marginBottom:32, textAlign:"center" }}>
            <h2 style={{
              fontFamily:"var(--font-d)", fontSize:26, marginBottom:6,
              letterSpacing:"-0.025em", color:"var(--t1)",
            }}>Welcome back</h2>
            <p style={{ fontSize:14, color:"var(--t3)" }}>Sign in to continue your journey</p>
          </div>

          {/* Role tabs */}
          <div style={{
            display:"flex", gap:3, background:"var(--s1)",
            borderRadius:"var(--r3)", padding:4, marginBottom:28,
            border:"1px solid var(--b1)",
          }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex:1, padding:"10px 0", borderRadius:"var(--r2)",
                border:"none", cursor:"pointer", transition:"all 0.22s",
                background: tab === t
                  ? "linear-gradient(135deg,var(--blu),var(--v2))"
                  : "transparent",
                color:     tab === t ? "#fff" : "var(--t3)",
                fontSize:13, fontWeight: tab === t ? 700 : 400,
                fontFamily:"var(--font-b)",
                boxShadow: tab === t ? "var(--sh-blu)" : "none",
                transform: tab === t ? "scale(1.02)" : "scale(1)",
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Glass login card */}
          <div style={{
            background:"rgba(15,22,41,0.7)", backdropFilter:"blur(24px)",
            border:"1px solid var(--b1)", borderRadius:"var(--r3)",
            padding:"28px 28px", boxShadow:"var(--sh-card)",
          }}>
            <LoginForm role={tab} key={tab}/>
          </div>
        </div>

        <p style={{ position:"absolute", bottom:20, fontSize:11, color:"var(--t4)" }}>
          © 2026 Cubiny Technologies · All rights reserved
        </p>
      </div>
    </div>
  );
}
