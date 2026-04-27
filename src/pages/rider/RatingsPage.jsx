// src/pages/rider/RatingsPage.jsx
import { Star } from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { MOCK_RATINGS } from "../../data/mockData";

export function RatingsPage() {
  const avg = (MOCK_RATINGS.reduce((s, r) => s + r.score, 0) / MOCK_RATINGS.length).toFixed(1);

  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 24 }}>My Ratings</h2>

      <div className="glass-violet" style={{ padding: 28, marginBottom: 20, textAlign: "center" }}>
        <div style={{ fontSize: 56, fontWeight: 800, fontFamily: "var(--font-display)", background: "linear-gradient(135deg,var(--clr-violet-2),var(--clr-cyan-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {avg}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "10px 0" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={20} color="var(--clr-amber)" fill={s <= Math.round(avg) ? "var(--clr-amber)" : "transparent"} />
          ))}
        </div>
        <div style={{ fontSize: 13, color: "var(--clr-txt-2)" }}>Average rating · {MOCK_RATINGS.length} reviews</div>
      </div>

      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 16 }}>Recent Reviews</h3>
        {MOCK_RATINGS.map((r, i) => (
          <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--clr-bor)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar initials={r.from.split(" ").map((n) => n[0]).join("")} size={32} />
                <span style={{ fontWeight: 500, fontSize: 14 }}>{r.from}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} color="var(--clr-amber)" fill={s <= r.score ? "var(--clr-amber)" : "transparent"} />
                ))}
              </div>
            </div>
            {r.comment && <p style={{ fontSize: 13, color: "var(--clr-txt-2)", marginLeft: 40 }}>{r.comment}</p>}
            <div style={{ fontSize: 11, color: "var(--clr-txt-3)", marginTop: 4, marginLeft: 40 }}>{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
