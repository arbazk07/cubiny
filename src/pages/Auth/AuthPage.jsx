// src/pages/Auth/AuthPage.jsx  —  Cubiny v2
import { useState } from "react";
import { LoginForm } from "./LoginForm";

function CubeGrid() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ position:"absolute", inset:0, opacity:0.08 }}>
      {Array.from({length:6}).map((_,r)=>
        Array.from({length:6}).map((_,c)=>(
          <rect key={`${r}-${c}`} x={c*68+4} y={r*68+4} width="60" height="60" rx="10"
            fill="none" stroke={`${(r+c)%2===0?"#8b5cf6":"#22d3ee"}`} strokeWidth="0.8" opacity={(r+c)%3===0?1:0.5}/>
        ))
      )}
    </svg>
  );
}

export function AuthPage() {
  const [tab, setTab] = useState("rider");
  const tabs = ["rider","driver","admin"];

  return (
    <div style={{
      minHeight:"100vh", display:"flex", position:"relative", overflow:"hidden",
      background: "radial-gradient(ellipse 100% 80% at 20% 10%, rgba(109,40,217,0.2) 0%,transparent 50%), radial-gradient(ellipse 80% 70% at 80% 90%, rgba(8,145,178,0.15) 0%,transparent 50%), #050510",
    }}>
      {/* Left — branding panel */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column", alignItems:"flex-start",
        justifyContent:"center", padding:"60px 80px", position:"relative",
        borderRight:"1px solid var(--b1)",
      }}>
        <CubeGrid/>
        <div style={{ position:"relative", zIndex:1 }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:48 }}>
            <div style={{ background:"linear-gradient(135deg,#6d28d9,#0891b2)", borderRadius:16, padding:12, display:"flex", boxShadow:"0 8px 32px rgba(109,40,217,0.4)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="9" height="9" rx="2.5" fill="white" opacity="0.95"/>
                <rect x="13" y="2" width="9" height="9" rx="2.5" fill="white" opacity="0.55"/>
                <rect x="2" y="13" width="9" height="9" rx="2.5" fill="white" opacity="0.55"/>
                <rect x="13" y="13" width="9" height="9" rx="2.5" fill="white" opacity="0.95"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"var(--font-d)", fontWeight:800, fontSize:32, background:"linear-gradient(135deg,#a78bfa,#67e8f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.03em" }}>
                Cubiny
              </div>
              <div style={{ fontSize:12, color:"var(--t4)", letterSpacing:"0.15em", textTransform:"uppercase" }}>Premium Rides</div>
            </div>
          </div>

          <h1 style={{ fontFamily:"var(--font-d)", fontSize:44, fontWeight:800, lineHeight:1.1, letterSpacing:"-0.03em", marginBottom:20, maxWidth:360 }}>
            Move smarter,<br/>
            <span style={{ background:"linear-gradient(135deg,var(--v3),var(--c3))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              ride better.
            </span>
          </h1>
          <p style={{ fontSize:15, color:"var(--t2)", lineHeight:1.7, maxWidth:320, marginBottom:48 }}>
            Cubiny connects you with verified drivers instantly. Real-time tracking, fair fares, and premium service — every ride.
          </p>

          {/* Feature chips */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[
              ["⚡","Surge pricing that's fair & transparent"],
              ["🛡️","Every driver background-verified"],
              ["💜","Rated #1 in Rawalpindi & Islamabad"],
            ].map(([emoji,text])=>(
              <div key={text} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", background:"var(--s1)", border:"1px solid var(--b1)", borderRadius:"var(--r2)" }}>
                <span style={{ fontSize:16 }}>{emoji}</span>
                <span style={{ fontSize:13, color:"var(--t2)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — login panel */}
      <div style={{ width:480, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:48, position:"relative" }}>
        <div style={{ width:"100%", maxWidth:380 }} className="animate-bounce-in">
          <div style={{ marginBottom:32, textAlign:"center" }}>
            <h2 style={{ fontFamily:"var(--font-d)", fontSize:24, marginBottom:6, letterSpacing:"-0.02em" }}>Welcome back</h2>
            <p style={{ fontSize:14, color:"var(--t3)" }}>Sign in to continue your journey</p>
          </div>

          {/* Role tabs */}
          <div style={{ display:"flex", gap:3, background:"var(--s1)", borderRadius:"var(--r2)", padding:4, marginBottom:28, border:"1px solid var(--b1)" }}>
            {tabs.map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1, padding:"9px 0", borderRadius:"var(--r1)",
                border:"none", cursor:"pointer",
                background: tab===t ? "linear-gradient(135deg,var(--v),var(--v2))" : "transparent",
                color:      tab===t ? "#fff" : "var(--t3)",
                fontSize:13, fontWeight:tab===t?600:400,
                fontFamily:"var(--font-b)", transition:"all 0.2s",
                boxShadow: tab===t ? "var(--sh-v)" : "none",
              }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          <LoginForm role={tab}/>
        </div>

        <p style={{ position:"absolute", bottom:24, fontSize:11, color:"var(--t4)" }}>
          © 2026 Cubiny Technologies · All rights reserved
        </p>
      </div>
    </div>
  );
}
