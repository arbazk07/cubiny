// src/components/ui/StatCard.jsx  —  Cubiny v2
const COLORS = {
  violet: { text:"var(--v3)", bg:"rgba(109,40,217,0.12)", border:"rgba(109,40,217,0.2)", glow:"rgba(109,40,217,0.08)" },
  cyan:   { text:"var(--c3)", bg:"rgba(8,145,178,0.10)",  border:"rgba(8,145,178,0.2)",  glow:"rgba(8,145,178,0.06)"  },
  green:  { text:"#4ade80",   bg:"rgba(34,197,94,0.10)",  border:"rgba(34,197,94,0.2)",  glow:"rgba(34,197,94,0.06)"  },
  amber:  { text:"#fcd34d",   bg:"rgba(245,158,11,0.10)", border:"rgba(245,158,11,0.2)", glow:"rgba(245,158,11,0.06)" },
  red:    { text:"#fb7185",   bg:"rgba(244,63,94,0.10)",  border:"rgba(244,63,94,0.2)",  glow:"rgba(244,63,94,0.06)"  },
};

export function StatCard({ icon: Icon, label, value, sub, trend, color = "violet" }) {
  const clr = COLORS[color] ?? COLORS.violet;
  return (
    <div
      className="animate-fade-up"
      style={{
        background:   `linear-gradient(135deg, ${clr.glow}, var(--s1))`,
        border:       `1px solid ${clr.border}`,
        borderRadius: "var(--r3)",
        padding:      "22px",
        display:      "flex",
        flexDirection:"column",
        gap:          10,
        boxShadow:    "var(--sh-card)",
        position:     "relative",
        overflow:     "hidden",
      }}
    >
      {/* Subtle corner glow */}
      <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, borderRadius:"50%", background:`radial-gradient(circle, ${clr.bg}, transparent)`, pointerEvents:"none" }} />

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:11, color:"var(--t3)", textTransform:"uppercase", letterSpacing:"0.1em", fontWeight:600 }}>{label}</span>
        <div style={{ background:clr.bg, borderRadius:10, padding:"7px", border:`1px solid ${clr.border}` }}>
          <Icon size={14} color={clr.text} />
        </div>
      </div>

      <div style={{ fontSize:26, fontWeight:800, fontFamily:"var(--font-d)", color:clr.text, letterSpacing:"-0.02em", lineHeight:1 }}>
        {value}
      </div>

      {(sub || trend) && (
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {trend && (
            <span style={{ fontSize:11, color: trend > 0 ? "#4ade80" : "#fb7185", fontWeight:600, fontFamily:"var(--font-m)" }}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
          {sub && <span style={{ fontSize:11, color:"var(--t3)" }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
