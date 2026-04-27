// src/components/ui/StatusPill.jsx  —  Cubiny v2
const PILL_MAP = {
  "Completed":       "pill-g",
  "In Progress":     "pill-c",
  "Driver En Route": "pill-v",
  "Requested":       "pill-a",
  "Accepted":        "pill-c",
  "Cancelled":       "pill-r",
  "Resolved":        "pill-g",
  "Open":            "pill-a",
  "Verified":        "pill-g",
  "Pending":         "pill-a",
  "Rejected":        "pill-r",
  "Flagged":         "pill-r",
  "Active":          "pill-g",
  "Suspended":       "pill-a",
  "Banned":          "pill-r",
  "Online":          "pill-g",
  "Offline":         "pill-a",
};

const DOT_MAP = {
  "pill-g": "var(--grn)",
  "pill-c": "var(--c3)",
  "pill-v": "var(--v3)",
  "pill-a": "var(--amb)",
  "pill-r": "var(--red)",
};

// Inline style map — avoids purged Tailwind classes
const STYLE_MAP = {
  "pill-g": { background:"rgba(34,197,94,0.14)",  color:"#4ade80", border:"1px solid rgba(34,197,94,0.35)"  },
  "pill-c": { background:"rgba(6,182,212,0.14)",  color:"var(--c4)", border:"1px solid rgba(6,182,212,0.35)"  },
  "pill-v": { background:"rgba(139,92,246,0.16)", color:"var(--v4)", border:"1px solid rgba(139,92,246,0.35)" },
  "pill-a": { background:"rgba(245,158,11,0.14)", color:"#fcd34d", border:"1px solid rgba(245,158,11,0.35)" },
  "pill-r": { background:"rgba(244,63,94,0.14)",  color:"#fb7185", border:"1px solid rgba(244,63,94,0.35)"  },
};

export function StatusPill({ status, showDot = true }) {
  const key   = PILL_MAP[status] ?? "pill-v";
  const style = STYLE_MAP[key]   ?? STYLE_MAP["pill-v"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 100,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.025em",
      ...style,
    }}>
      {showDot && (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: DOT_MAP[key], flexShrink: 0 }} />
      )}
      {status}
    </span>
  );
}
