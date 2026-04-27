// src/pages/admin/AdminPanel.jsx
// ─────────────────────────────────────────────────────────────────
// Mission Control — full platform overview for admins only.
// DCL: only accessible when role === "admin" (enforced by AppShell).
// Driver flagging mirrors the PDF §5 trigger logic.
// ─────────────────────────────────────────────────────────────────
import { Activity, DollarSign, Users, Map, AlertTriangle } from "lucide-react";
import { StatCard }   from "../../components/ui/StatCard";
import { StatusPill } from "../../components/ui/StatusPill";
import { Avatar }     from "../../components/ui/Avatar";
import {
  MOCK_PLATFORM_STATS,
  MOCK_ACTIVE_RIDES,
  MOCK_FLAGGED_DRIVERS,
  MOCK_REVENUE_BY_METHOD,
} from "../../data/mockData";

export function AdminPanel() {
  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Mission Control</h2>
          <p style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>Live platform overview · {new Date().toLocaleDateString()}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "6px 14px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--clr-green)", animation: "pulse 1.5s ease infinite" }} />
          <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>Live</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
        <StatCard icon={DollarSign} label="Total Revenue"  value={`Rs. ${MOCK_PLATFORM_STATS.totalRevenue.toLocaleString()}`}  color="green"  />
        <StatCard icon={Activity}   label="Active Rides"   value={String(MOCK_PLATFORM_STATS.activeRides)}                      color="cyan"   />
        <StatCard icon={Users}      label="Drivers"        value={MOCK_PLATFORM_STATS.registeredDrivers.toLocaleString()}       color="violet" />
        <StatCard icon={Users}      label="Riders"         value={MOCK_PLATFORM_STATS.registeredRiders.toLocaleString()}        color="amber"  />
        <StatCard icon={DollarSign} label="Today's Rev"    value={`Rs. ${MOCK_PLATFORM_STATS.todayRevenue.toLocaleString()}`}  color="cyan"   />
      </div>

      {/* Live rides table */}
      <div className="glass" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>Live Rides</h3>
          <span style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>{MOCK_ACTIVE_RIDES.length} active</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOCK_ACTIVE_RIDES.map((ride) => (
            <div
              key={ride.id}
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "14px 16px",
                background:     "var(--clr-sur)",
                borderRadius:   12,
                border:         "1px solid var(--clr-bor)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: "var(--clr-sur-2)", borderRadius: 8, padding: 8 }}>
                  <Map size={14} color="var(--clr-violet-3)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ride.rider} → {ride.driver}</div>
                  <div style={{ fontSize: 11, color: "var(--clr-txt-3)" }}>{ride.from} → {ride.to}</div>
                  {ride.surgeApplied && (
                    <div style={{ fontSize: 10, color: "var(--clr-amber)", marginTop: 2 }}>
                      ⚡ Surge ×{ride.surgeMultiplier}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <StatusPill status={ride.status} />
                <span style={{ fontSize: 11, color: "var(--clr-txt-3)" }}>
                  Rs. {ride.fare} · {ride.elapsedTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged drivers (PDF §5 trigger output) */}
      <div className="glass" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>Flagged Drivers</h3>
          <AlertTriangle size={14} color="var(--clr-amber)" />
        </div>

        {MOCK_FLAGGED_DRIVERS.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--clr-txt-3)" }}>No flagged drivers — all ratings above 3.5 ★</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MOCK_FLAGGED_DRIVERS.map((d) => (
              <div
                key={d.id}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  padding:        "14px 16px",
                  background:     "rgba(245,158,11,0.06)",
                  borderRadius:   12,
                  border:         "1px solid rgba(245,158,11,0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar initials={d.name.split(" ").map((n) => n[0]).join("")} size={36} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "var(--clr-txt-3)" }}>{d.id} · {d.trips} trips</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#f87171" }}>★ {d.rating}</span>
                  <StatusPill status="Flagged" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue by payment method */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 18 }}>Revenue by Payment Method</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MOCK_REVENUE_BY_METHOD.map((r, i) => (
            <div key={r.method}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span>{r.method}</span>
                <span style={{ fontWeight: 600 }}>{r.pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 6, background: "var(--clr-sur-2)" }}>
                <div style={{
                  height:       "100%",
                  borderRadius: 6,
                  width:        `${r.pct}%`,
                  background:   i === 0
                    ? "linear-gradient(90deg,var(--clr-violet),var(--clr-violet-2))"
                    : i === 1
                      ? "linear-gradient(90deg,var(--clr-cyan),var(--clr-cyan-2))"
                      : "linear-gradient(90deg,#f59e0b,#fcd34d)",
                  transition:   "width 1s ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
