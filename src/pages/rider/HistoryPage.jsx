// src/pages/rider/HistoryPage.jsx
import { MapPin, Navigation, ArrowRight, Star } from "lucide-react";
import { StatusPill } from "../../components/ui/StatusPill";
import { MOCK_RIDE_HISTORY } from "../../data/mockData";

export function HistoryPage() {
  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 24 }}>Ride History</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MOCK_RIDE_HISTORY.map((r) => (
          <div key={r.id} className="glass animate-fade-up" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "var(--clr-txt-3)" }}>{r.id}</span>
              <StatusPill status={r.status} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <MapPin    size={12} color="var(--clr-cyan-2)" />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{r.from}</span>
              <ArrowRight size={12} color="var(--clr-txt-3)" />
              <Navigation size={12} color="var(--clr-violet-3)" />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{r.to}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--clr-txt-2)" }}>
              <span>{r.date}</span>
              {r.driver !== "N/A" && <span>Driver: {r.driver}</span>}
              <span style={{ fontWeight: 600, color: "var(--clr-txt)" }}>Rs. {r.fare}</span>
            </div>

            {r.driverRating && (
              <div style={{ marginTop: 10, display: "flex", gap: 3 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} color="var(--clr-amber)" fill={s <= r.driverRating ? "var(--clr-amber)" : "transparent"} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
