// src/components/ui/StatusPill.jsx — Cubiny v5
const STATUS_MAP = {
  "Completed":        { cls:"pill-grn", dot:"var(--grn2)" },
  "In Progress":      { cls:"pill-blu", dot:"var(--blu2)" },
  "Driver En Route":  { cls:"pill-blu", dot:"var(--blu2)" },
  "En Route":         { cls:"pill-blu", dot:"var(--blu2)" },
  "Accepted":         { cls:"pill-v",   dot:"var(--v3)"   },
  "Requested":        { cls:"pill-a",   dot:"var(--amb)"  },
  "Cancelled":        { cls:"pill-r",   dot:"#fb7185"     },
  "Pending":          { cls:"pill-a",   dot:"var(--amb)"  },
  "Active":           { cls:"pill-grn", dot:"var(--grn2)" },
  "Offline":          { cls:"pill-r",   dot:"#fb7185"     },
  "Online":           { cls:"pill-grn", dot:"var(--grn2)" },
  "Flagged":          { cls:"pill-r",   dot:"#fb7185"     },
  "Verified":         { cls:"pill-grn", dot:"var(--grn2)" },
};

export function StatusPill({ status }) {
  const cfg = STATUS_MAP[status] ?? { cls:"pill-v", dot:"var(--v3)" };
  return (
    <span className={`pill ${cfg.cls}`}>
      <span style={{
        width:5, height:5, borderRadius:"50%", background:cfg.dot,
        boxShadow:`0 0 6px ${cfg.dot}`,
        animation:"pulse-dot 2s ease infinite",
      }}/>
      {status}
    </span>
  );
}
