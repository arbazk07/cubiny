// src/components/ui/StatCard.jsx
const COLOR_MAP = {
  violet: { text: "var(--clr-violet-3)", bg: "rgba(124,58,237,0.12)" },
  cyan:   { text: "var(--clr-cyan-2)",   bg: "rgba(6,182,212,0.1)"   },
  green:  { text: "#4ade80",             bg: "rgba(34,197,94,0.12)"  },
  amber:  { text: "#fcd34d",             bg: "rgba(245,158,11,0.12)" },
  red:    { text: "#f87171",             bg: "rgba(239,68,68,0.12)"  },
};

export function StatCard({ icon: Icon, label, value, sub, color = "violet" }) {
  const { text, bg } = COLOR_MAP[color] ?? COLOR_MAP.violet;
  return (
    <div className="glass animate-fade-up" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "var(--clr-txt-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
        <div style={{ background: bg, borderRadius: 8, padding: 6 }}>
          <Icon size={14} color={text} />
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: text }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--clr-txt-3)" }}>{sub}</div>}
    </div>
  );
}
