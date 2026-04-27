// src/pages/driver/DriverDashboard.jsx
// ─────────────────────────────────────────────────────────────────
// Go Live screen with online/offline toggle.
// Incoming ride popup simulates a WebSocket push event.
// Rating trigger: drivers below 3.5 are auto-flagged (PDF §5).
// ─────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Shield, DollarSign, TrendingUp, Car, Star, CheckCircle, XCircle, MapPin, Navigation } from "lucide-react";
import { useAuth }    from "../../hooks/useAuth";
import { Avatar }     from "../../components/ui/Avatar";
import { StatCard }   from "../../components/ui/StatCard";
import { Button }     from "../../components/ui/Button";
import { StatusPill } from "../../components/ui/StatusPill";
import { MOCK_INCOMING_RIDE, MOCK_EARNINGS_CHART } from "../../data/mockData";

// ── Rating trigger (PDF §5) ──────────────────────────────────────
// Mirrors: AFTER UPDATE ON drivers FOR EACH ROW
//   IF NEW.averageRating < 3.5 THEN flag the account
const RATING_THRESHOLD = 3.5;
function checkRatingTrigger(rating) {
  return rating < RATING_THRESHOLD;
}

export function DriverDashboard() {
  const { user }                      = useAuth();
  const [isOnline,     setIsOnline]   = useState(false);
  const [showRequest,  setShowRequest]= useState(false);
  const [activeRide,   setActiveRide] = useState(null);
  const [countdown,    setCountdown]  = useState(30);

  const isFlagged = checkRatingTrigger(user?.rating ?? 5);
  const maxEarning = Math.max(...MOCK_EARNINGS_CHART.map((e) => e.amount));

  // Simulate incoming ride push after going online
  useEffect(() => {
    if (!isOnline) { setShowRequest(false); return; }
    const t = setTimeout(() => setShowRequest(true), 3000);
    return () => clearTimeout(t);
  }, [isOnline]);

  // Countdown timer
  useEffect(() => {
    if (!showRequest) { setCountdown(30); return; }
    if (countdown <= 0) { setShowRequest(false); return; }
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [showRequest, countdown]);

  const acceptRide  = () => { setActiveRide(MOCK_INCOMING_RIDE); setShowRequest(false); };
  const declineRide = () => { setShowRequest(false); setCountdown(30); };

  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh", display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Driver Hub</h2>
          <p style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>
            {user?.name} · {user?.vehicle?.make} {user?.vehicle?.model}
          </p>
        </div>
        {user?.verified && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 20, padding: "6px 14px" }}>
            <Shield size={12} color="var(--clr-green)" />
            <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600 }}>Verified Driver</span>
          </div>
        )}
      </div>

      {/* Flagged warning (PDF §5 trigger) */}
      {isFlagged && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--r)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: "#f87171", fontSize: 14 }}>Account Flagged</div>
            <div style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>Your rating is below {RATING_THRESHOLD} stars. Admin has been notified.</div>
          </div>
        </div>
      )}

      {/* Online toggle */}
      <div className="glass" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 4, color: isOnline ? "#4ade80" : "var(--clr-txt-2)" }}>
            {isOnline ? "You're Online" : "You're Offline"}
          </div>
          <p style={{ fontSize: 13, color: "var(--clr-txt-2)" }}>
            {isOnline ? "Receiving ride requests in your area" : "Toggle to start accepting rides"}
          </p>
        </div>
        <button
          onClick={() => { setIsOnline((v) => !v); setActiveRide(null); }}
          style={{
            position:   "relative",
            width:      72, height: 36,
            borderRadius: 100,
            border:     "none",
            cursor:     "pointer",
            background: isOnline ? "linear-gradient(135deg,#16a34a,#22c55e)" : "var(--clr-sur-2)",
            transition: "all 0.3s",
            animation:  isOnline ? "glowGreen 2s ease infinite" : "none",
            boxShadow:  isOnline ? "0 0 20px rgba(34,197,94,0.4)" : "none",
          }}
        >
          <div style={{
            position:   "absolute",
            top: 4, left: isOnline ? 38 : 4,
            width: 28, height: 28,
            borderRadius: "50%",
            background:  "#fff",
            transition:  "left 0.3s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        <StatCard icon={DollarSign} label="This Week"   value={`Rs. ${user?.weeklyEarnings?.toLocaleString()}`} color="green"  />
        <StatCard icon={TrendingUp} label="All Time"    value={`Rs. ${user?.earnings?.toLocaleString()}`}       color="violet" />
        <StatCard icon={Car}        label="Total Trips" value={String(user?.totalTrips)}                        color="cyan"   />
        <StatCard icon={Star}       label="Rating"      value={`${user?.rating} ★`}                            color="amber"  />
      </div>

      {/* Earnings chart */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 20 }}>Weekly Earnings</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {MOCK_EARNINGS_CHART.map((e, i) => (
            <div key={e.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ fontSize: 9, color: "var(--clr-txt-3)" }}>{e.amount}</div>
              <div style={{
                width:      "100%",
                borderRadius: "6px 6px 0 0",
                height:     `${(e.amount / maxEarning) * 88}px`,
                background: i === 4
                  ? "linear-gradient(180deg,var(--clr-violet-2),var(--clr-violet))"
                  : "linear-gradient(180deg,rgba(124,58,237,0.4),rgba(124,58,237,0.1))",
                boxShadow:  i === 4 ? "var(--sh-v)" : "none",
                transition: "height 0.5s ease",
              }} />
              <div style={{ fontSize: 10, color: i === 4 ? "var(--clr-violet-3)" : "var(--clr-txt-3)", fontWeight: i === 4 ? 600 : 400 }}>
                {e.day}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active ride */}
      {activeRide && (
        <div className="glass-violet animate-fade-up" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15 }}>Active Ride</h3>
            <StatusPill status="In Progress" />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--clr-txt-2)" }}>
            <span>{activeRide.rider}</span>
            <span>Rs. {activeRide.fare}</span>
            <span>{activeRide.distanceKm} km</span>
          </div>
        </div>
      )}

      {/* ── Incoming ride popup ── */}
      {showRequest && (
        <div style={{
          position:       "fixed",
          inset:          0,
          zIndex:         999,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}>
          <div className="glass animate-bounce-in" style={{ width: "100%", maxWidth: 380, margin: 20 }}>
            {/* Coloured header */}
            <div style={{
              background:   "linear-gradient(135deg,var(--clr-violet),var(--clr-cyan))",
              borderRadius: "var(--r-2) var(--r-2) 0 0",
              padding:      "20px 24px",
              position:     "relative",
            }}>
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#fff" }}>
                {countdown}s
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>NEW RIDE REQUEST</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#fff" }}>Rs. {MOCK_INCOMING_RIDE.fare}</h3>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <Avatar initials="FZ" size={44} />
                <div>
                  <div style={{ fontWeight: 600 }}>{MOCK_INCOMING_RIDE.rider}</div>
                  <div style={{ fontSize: 12, color: "var(--clr-txt-2)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={11} color="var(--clr-amber)" fill="var(--clr-amber)" />
                    {MOCK_INCOMING_RIDE.riderRating} rating
                  </div>
                </div>
              </div>

              {[
                { label: "Pickup",    val: MOCK_INCOMING_RIDE.from, icon: MapPin,     c: "var(--clr-cyan-2)"   },
                { label: "Drop-off",  val: MOCK_INCOMING_RIDE.to,   icon: Navigation, c: "var(--clr-violet-3)" },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, padding: "10px 14px", background: "var(--clr-sur)", borderRadius: 10, border: "1px solid var(--clr-bor)" }}>
                  <r.icon size={13} color={r.c} />
                  <div>
                    <div style={{ fontSize: 10, color: "var(--clr-txt-3)" }}>{r.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.val}</div>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--clr-txt-2)", marginBottom: 20, padding: "10px 14px", background: "var(--clr-sur)", borderRadius: 10 }}>
                <span>Distance: {MOCK_INCOMING_RIDE.distanceKm} km</span>
                <span>ETA: {MOCK_INCOMING_RIDE.driverEta}</span>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <Button variant="danger"  style={{ flex: 1 }} onClick={declineRide}>
                  <XCircle size={16} /> Decline
                </Button>
                <Button variant="primary" style={{ flex: 1 }} onClick={acceptRide}>
                  <CheckCircle size={16} /> Accept
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
