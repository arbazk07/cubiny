// src/components/ui/StatusPill.jsx
const PILL_MAP = {
  "Completed":       "pill-green",
  "In Progress":     "pill-cyan",
  "Driver En Route": "pill-violet",
  "Requested":       "pill-amber",
  "Accepted":        "pill-cyan",
  "Cancelled":       "pill-red",
  "Resolved":        "pill-green",
  "Open":            "pill-amber",
  "Verified":        "pill-green",
  "Pending":         "pill-amber",
  "Rejected":        "pill-red",
  "Flagged":         "pill-red",
  "Active":          "pill-green",
  "Suspended":       "pill-amber",
  "Banned":          "pill-red",
  "Online":          "pill-green",
  "Offline":         "pill-amber",
};

export function StatusPill({ status }) {
  return (
    <span className={`pill ${PILL_MAP[status] ?? "pill-violet"}`}>
      {status}
    </span>
  );
}
