// src/pages/rider/RiderDashboard.jsx
// ─────────────────────────────────────────────────────────────────
// Core rider screen: book ride, track state, view driver details.
// Ride state machine: idle → searching → found → en_route →
//                     in_progress → completed
// ─────────────────────────────────────────────────────────────────
import { useState }   from "react";
import { MapPin, Navigation, Phone, MessageSquare, CheckCircle, Star, X, ArrowRight } from "lucide-react";
import { MockMap }    from "../../components/map/MockMap";
import { Button }     from "../../components/ui/Button";
import { Input }      from "../../components/ui/Input";
import { Modal }      from "../../components/ui/Modal";
import { Avatar }     from "../../components/ui/Avatar";
import { StatusPill } from "../../components/ui/StatusPill";
import { FARE_CONFIG, SURGE_CONFIG } from "../../data/mockData";

// ── Surge pricing helper ─────────────────────────────────────────
// Mirrors the stored procedure described in PDF §4 Fare & Payment.
function getSurgeMultiplier() {
  const hour = new Date().getHours();
  const match = SURGE_CONFIG.peakHours.find(
    (p) => hour >= p.start && hour < p.end,
  );
  return match ? match.multiplier : SURGE_CONFIG.defaultMultiplier;
}

function calcFare(type, distanceKm = 7.2, durationMin = 18) {
  const cfg        = FARE_CONFIG[type];
  const base       = cfg.baseRate + cfg.perKmRate * distanceKm + cfg.perMinuteRate * durationMin;
  const multiplier = getSurgeMultiplier();
  return { fare: Math.round(base * multiplier), surgeApplied: multiplier > 1, multiplier };
}

// ── Post-trip rating modal ───────────────────────────────────────
function RatingModal({ open, onClose }) {
  const [rating,  setRating]  = useState(0);
  const [hover,   setHover]   = useState(0);
  const [comment, setComment] = useState("");
  const [done,    setDone]    = useState(false);

  const submit = () => {
    setDone(true);
    setTimeout(onClose, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} title="Rate your driver" maxWidth={400}>
      {done ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <CheckCircle size={48} color="var(--clr-green)" style={{ margin: "0 auto 16px" }} />
          <p style={{ fontWeight: 600, fontFamily: "var(--font-display)" }}>Thanks for rating!</p>
        </div>
      ) : (
        <>
          <p style={{ textAlign: "center", color: "var(--clr-txt-2)", fontSize: 13, marginBottom: 24 }}>Hassan Raza</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                style={{ background: "none", border: "none", cursor: "pointer", transition: "transform 0.15s", transform: (hover || rating) >= s ? "scale(1.2)" : "scale(1)" }}
              >
                <Star size={32} color="var(--clr-amber)" fill={(hover || rating) >= s ? "var(--clr-amber)" : "transparent"} />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", height: 80, resize: "none", background: "var(--clr-sur)", border: "1px solid var(--clr-bor-2)", borderRadius: "var(--r)", padding: "12px 16px", fontSize: 14, color: "var(--clr-txt)", marginBottom: 16 }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" fullWidth onClick={onClose}>Skip</Button>
            <Button variant="primary"   fullWidth onClick={submit} disabled={!rating}>Submit</Button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ── Ride type card ───────────────────────────────────────────────
function RideTypeCard({ type, selected, onSelect, distanceKm }) {
  const { fare, surgeApplied, multiplier } = calcFare(type.id, distanceKm);
  return (
    <button
      onClick={() => onSelect(type.id)}
      style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "14px 16px",
        borderRadius:   12,
        border:         `1px solid ${selected ? "var(--clr-violet-2)" : "var(--clr-bor)"}`,
        background:     selected ? "rgba(124,58,237,0.12)" : "var(--clr-sur)",
        color:          "var(--clr-txt)",
        width:          "100%",
        cursor:         "pointer",
        transition:     "all 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <type.icon size={16} color={selected ? "var(--clr-violet-3)" : "var(--clr-txt-2)"} />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{type.label}</div>
          <div style={{ fontSize: 11, color: "var(--clr-txt-2)" }}>{type.eta}</div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: selected ? "var(--clr-violet-3)" : "var(--clr-txt)" }}>
          Rs. {fare}
        </div>
        {surgeApplied && (
          <div style={{ fontSize: 10, color: "var(--clr-amber)" }}>⚡ {multiplier}× surge</div>
        )}
      </div>
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────
import { Car, Zap, Bike } from "lucide-react";

const RIDE_TYPES = [
  { id: "Economy", label: "Economy", icon: Car,  eta: "5 min" },
  { id: "Premium", label: "Premium", icon: Zap,  eta: "8 min" },
  { id: "Bike",    label: "Bike",    icon: Bike, eta: "3 min" },
];

const STATE_LABELS = {
  searching:   "Finding your driver…",
  found:       "Driver found!",
  en_route:    "Driver is on the way",
  in_progress: "Trip in progress",
  completed:   "Trip completed!",
};

export function RiderDashboard() {
  const [rideState,    setRideState]    = useState("idle");
  const [pickup,       setPickup]       = useState("");
  const [dropoff,      setDropoff]      = useState("");
  const [selectedType, setSelectedType] = useState("Economy");
  const [showRating,   setShowRating]   = useState(false);

  const DISTANCE_KM = 7.2;
  const { fare, surgeApplied, multiplier } = calcFare(selectedType, DISTANCE_KM);

  const requestRide = () => {
    if (!pickup || !dropoff) return;
    setRideState("searching");
    setTimeout(() => setRideState("found"),       2000);
    setTimeout(() => setRideState("en_route"),    3500);
    setTimeout(() => setRideState("in_progress"), 6000);
    setTimeout(() => { setRideState("completed"); setShowRating(true); }, 10000);
  };

  const isIdle      = rideState === "idle";
  const isCompleted = rideState === "completed";
  const showDriver  = ["found","en_route","in_progress","completed"].includes(rideState);
  const showRoute   = ["en_route","in_progress","completed"].includes(rideState);

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>

      {/* ── Map ── */}
      <div style={{ flex: 1, position: "relative" }}>
        <MockMap showRoute={showRoute} showRider showDriver={showDriver} />

        {/* Status banner */}
        {!isIdle && (
          <div
            className="glass animate-fade-up"
            style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", padding: "10px 20px", display: "flex", alignItems: "center", gap: 10 }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background:  rideState === "searching" ? "var(--clr-amber)" : "var(--clr-green)",
              animation:   "pulse 1s ease infinite",
            }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>{STATE_LABELS[rideState]}</span>
          </div>
        )}
      </div>

      {/* ── Side panel ── */}
      <div style={{
        width:        340,
        background:   "var(--clr-bg-2)",
        borderLeft:   "1px solid var(--clr-bor)",
        overflowY:    "auto",
        padding:      24,
        display:      "flex",
        flexDirection:"column",
        gap:          20,
      }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 4 }}>Book a Ride</h2>
          <p style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>Rawalpindi / Islamabad</p>
        </div>

        {/* ── IDLE: booking form ── */}
        {isIdle && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Input
                icon={MapPin}
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
              <Input
                icon={Navigation}
                placeholder="Drop-off destination"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>Ride type</p>
              {RIDE_TYPES.map((t) => (
                <RideTypeCard
                  key={t.id}
                  type={t}
                  selected={selectedType === t.id}
                  onSelect={setSelectedType}
                  distanceKm={DISTANCE_KM}
                />
              ))}
            </div>

            {/* Fare summary */}
            <div className="glass-violet" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--clr-txt-2)" }}>Estimated Fare</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", background: "linear-gradient(135deg,var(--clr-violet-2),var(--clr-cyan-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Rs. {fare}
                </div>
                {surgeApplied && <div style={{ fontSize: 10, color: "var(--clr-amber)" }}>⚡ Surge ×{multiplier}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--clr-txt-2)" }}>Distance</div>
                <div style={{ fontWeight: 600 }}>{DISTANCE_KM} km</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--clr-txt-2)" }}>ETA</div>
                <div style={{ fontWeight: 600 }}>~18 min</div>
              </div>
            </div>

            <Button fullWidth onClick={requestRide}>
              <MapPin size={16} /> Request Ride
            </Button>
          </>
        )}

        {/* ── ACTIVE: driver card + route info ── */}
        {!isIdle && !isCompleted && (
          <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass-violet" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <StatusPill status={rideState === "in_progress" ? "In Progress" : rideState === "en_route" ? "Driver En Route" : rideState === "found" ? "Accepted" : "Requested"} />
                <span style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>RD-8823</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Avatar initials="HR" size={44} glow={rideState === "en_route"} />
                <div>
                  <div style={{ fontWeight: 600 }}>Hassan Raza</div>
                  <div style={{ fontSize: 12, color: "var(--clr-txt-2)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={11} color="var(--clr-amber)" fill="var(--clr-amber)" /> 4.9 · Toyota Corolla
                  </div>
                  <div style={{ fontSize: 11, color: "var(--clr-txt-3)" }}>LEJ-3421 · White</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" style={{ flex: 1, padding: "8px 0", fontSize: 12 }}><Phone size={12} /> Call</Button>
                <Button variant="secondary" style={{ flex: 1, padding: "8px 0", fontSize: 12 }}><MessageSquare size={12} /> Chat</Button>
              </div>
            </div>

            {[
              { label: "From", val: pickup || "F-10 Markaz",    icon: MapPin,    c: "var(--clr-cyan-2)"   },
              { label: "To",   val: dropoff || "Centaurus Mall", icon: Navigation, c: "var(--clr-violet-3)" },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--clr-sur)", borderRadius: 10, border: "1px solid var(--clr-bor)" }}>
                <r.icon size={14} color={r.c} />
                <div>
                  <div style={{ fontSize: 10, color: "var(--clr-txt-3)" }}>{r.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{r.val}</div>
                </div>
              </div>
            ))}

            <div className="glass" style={{ padding: 14, display: "flex", justifyContent: "space-between" }}>
              <div><div style={{ fontSize: 10, color: "var(--clr-txt-2)" }}>Fare</div><div style={{ fontWeight: 700, fontSize: 18 }}>Rs. {fare}</div></div>
              <div><div style={{ fontSize: 10, color: "var(--clr-txt-2)" }}>Payment</div><div style={{ fontSize: 13, fontWeight: 500 }}>Wallet</div></div>
            </div>
          </div>
        )}

        {/* ── COMPLETED ── */}
        {isCompleted && (
          <div className="glass-cyan animate-bounce-in" style={{ padding: 24, textAlign: "center" }}>
            <CheckCircle size={44} color="var(--clr-cyan-2)" style={{ margin: "0 auto 12px" }} />
            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 6 }}>Trip Completed!</h3>
            <p style={{ fontSize: 13, color: "var(--clr-txt-2)", marginBottom: 20 }}>Rs. {fare} charged to wallet</p>
            <Button fullWidth onClick={() => { setRideState("idle"); setPickup(""); setDropoff(""); }}>
              Book Another Ride
            </Button>
          </div>
        )}
      </div>

      {/* Rating modal */}
      <RatingModal open={showRating} onClose={() => setShowRating(false)} />
    </div>
  );
}
