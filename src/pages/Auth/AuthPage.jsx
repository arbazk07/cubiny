// src/pages/Auth/AuthPage.jsx
import { useState } from "react";
import { Car }       from "lucide-react";
import { LoginForm } from "./LoginForm";

export function AuthPage() {
  const [tab, setTab] = useState("rider");

  return (
    <div
      className="mesh-bg"
      style={{
        minHeight:      "100vh",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        padding:        20,
        position:       "relative",
        overflow:       "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", top: -200, left: -100, background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", bottom: -100, right: -50, background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />
      </div>

      <div className="animate-bounce-in" style={{ width: "100%", maxWidth: 440, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ background: "linear-gradient(135deg,var(--clr-violet),var(--clr-cyan))", borderRadius: 14, padding: 10, display: "flex" }}>
              <Car size={24} color="#fff" />
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, background: "linear-gradient(135deg,var(--clr-violet-2),var(--clr-cyan-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              IzenRides
            </h1>
          </div>
          <p style={{ color: "var(--clr-txt-2)", fontSize: 14 }}>Premium ride-hailing for the modern city</p>
        </div>

        <div className="glass" style={{ padding: 32 }}>
          {/* Role tabs */}
          <div style={{ display: "flex", gap: 4, background: "var(--clr-sur)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {["rider", "driver", "admin"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex:       1,
                  padding:    "8px 0",
                  borderRadius: 8,
                  border:     "none",
                  background: tab === t ? "linear-gradient(135deg,var(--clr-violet),var(--clr-violet-2))" : "transparent",
                  color:      tab === t ? "#fff" : "var(--clr-txt-2)",
                  fontSize:   13,
                  fontWeight: 500,
                  cursor:     "pointer",
                  transition: "all 0.2s",
                  boxShadow:  tab === t ? "var(--sh-v)" : "none",
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <LoginForm role={tab} />
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "var(--clr-txt-3)" }}>
          Click Sign In with any credentials to demo · No real data stored
        </p>
      </div>
    </div>
  );
}
