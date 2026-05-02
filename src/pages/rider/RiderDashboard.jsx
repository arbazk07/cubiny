// src/pages/rider/RiderDashboard.jsx — Cubiny v5
//
// BUG FIX #1: useRef tracks all timeout IDs — clearAllTimeouts() called on
//             re-request AND on component unmount, preventing stale state
//             updates from a previous booking ghosting into the new one.
//
// BUG FIX #2: Ride lifecycle now has realistic durations:
//             searching → found (3s) → en_route (6s) → in_progress (11s) → completed (19s)
//             Previously it "appeared" to jump due to stale timeout refs.
//
// BUG FIX #3: Driver card now uses dynamic data from MOCK_INCOMING_RIDE / MOCK_USERS.driver
//             instead of hardcoded string literals scattered everywhere.
//
// BUG FIX #4: handleRequest validates pickup/dropoff before calling API.
//
// UI UPGRADE: Premium glassmorphism cards, vibrant status pills, smoother animations.

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Phone, MessageSquare, CheckCircle, Star, Car, Zap, Bike, Navigation2 } from "lucide-react";
import { LiveMap }    from "../../components/map/LiveMap";
import { Button }     from "../../components/ui/Button";
import { Modal }      from "../../components/ui/Modal";
import { Avatar }     from "../../components/ui/Avatar";
import { StatusPill } from "../../components/ui/StatusPill";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { getAllFares }     from "../../services/fareService";
import { requestRide }    from "../../services/mockService";
import { electronNotify } from "../../hooks/useElectron";
import { MOCK_USERS, MOCK_INCOMING_RIDE } from "../../data/mockData";

const TYPES = [
  { id:"Economy", icon:Car,  desc:"Affordable, everyday"    },
  { id:"Premium", icon:Zap,  desc:"Comfort & luxury sedan"  },
  { id:"Bike",    icon:Bike, desc:"Fast, beat the traffic"  },
];

const STATES = {
  searching:   { label:"Finding your driver…",      color:"var(--amb)",  pill:"bg" },
  found:       { label:"Driver confirmed!",          color:"var(--grn2)", pill:"grn" },
  en_route:    { label:"Driver is on the way",       color:"var(--blu2)", pill:"blu" },
  in_progress: { label:"Enjoy your ride",            color:"var(--v3)",   pill:"v" },
  completed:   { label:"You've arrived safely!",     color:"var(--grn2)", pill:"grn" },
};

// ── Dynamic driver info from mock data ───────────────────────────────────────
const DRIVER    = MOCK_USERS.driver;
const RIDE_INFO = MOCK_INCOMING_RIDE;

// ── Rating Modal ─────────────────────────────────────────────────────────────
function RatingModal({ open, onClose, driver, fare }) {
  const [score,   setScore]   = useState(0);
  const [hover,   setHover]   = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const submit = async () => {
    if (!score) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setDone(true);
    setTimeout(onClose, 1600);
  };

  return (
    <Modal open={open} onClose={onClose}
      title="Rate your driver"
      subtitle={`How was your experience with ${driver.name}?`}>
      {done ? (
        <div style={{ textAlign:"center", padding:"24px 0" }}>
          <CheckCircle size={56} color="var(--grn2)" style={{ margin:"0 auto 16px" }}/>
          <p style={{ fontFamily:"var(--font-d)", fontSize:18, marginBottom:4 }}>Thanks for the rating!</p>
          <p style={{ fontSize:13, color:"var(--t3)" }}>Your feedback keeps Cubiny premium.</p>
        </div>
      ) : (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 0 20px", borderBottom:"1px solid var(--b1)", marginBottom:20 }}>
            <Avatar initials={driver.avatar} size={52}/>
            <div>
              <div style={{ fontWeight:700, fontSize:15 }}>{driver.name}</div>
              <div style={{ fontSize:12, color:"var(--t3)", marginTop:2 }}>
                {driver.vehicle.make} {driver.vehicle.model} · {driver.vehicle.plate}
              </div>
              <div style={{ fontSize:11, color:"var(--amb)", marginTop:3, display:"flex", alignItems:"center", gap:3 }}>
                <Star size={10} fill="var(--amb)" color="var(--amb)"/> {driver.rating}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:20 }}>
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button"
                onClick={() => setScore(s)}
                onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
                style={{
                  background:"none", border:"none", cursor:"pointer",
                  transition:"transform 0.15s",
                  transform: (hover || score) >= s ? "scale(1.3)" : "scale(1)",
                }}>
                <Star size={34} color="var(--amb)"
                  fill={(hover || score) >= s ? "var(--amb)" : "transparent"}/>
              </button>
            ))}
          </div>

          {score > 0 && (
            <div style={{ textAlign:"center", marginBottom:14, fontSize:14, color:"var(--t2)", fontWeight:600 }}>
              {["","Poor","Below average","Good","Very good","Excellent! 🎉"][score]}
            </div>
          )}

          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Add a comment (optional)…"
            style={{
              width:"100%", height:80, resize:"none",
              background:"var(--s2)", border:"1px solid var(--b2)",
              borderRadius:"var(--r2)", padding:"12px 16px",
              fontSize:14, color:"var(--t1)", marginBottom:16,
              fontFamily:"var(--font-b)",
            }}/>

          <div style={{ display:"flex", gap:10 }}>
            <Button variant="secondary" fullWidth onClick={onClose}>Skip</Button>
            <Button variant="primary"   fullWidth onClick={submit}
              loading={loading} disabled={!score}>
              Submit Rating
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export function RiderDashboard() {
  const [state,      setState]      = useState("idle");
  const [pickup,     setPickup]     = useState("");
  const [dropoff,    setDropoff]    = useState("");
  const [pickupErr,  setPickupErr]  = useState(false);
  const [dropoffErr, setDropoffErr] = useState(false);
  const [selType,    setSelType]    = useState("Economy");
  const [fares,      setFares]      = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showRate,   setShowRate]   = useState(false);
  const [rideId,     setRideId]     = useState(null);

  // ── BUG FIX: track all setTimeout IDs so we can cancel stale ones ──────────
  const timeoutsRef = useRef([]);
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Clean up on unmount — prevents "setState on unmounted component"
  useEffect(() => () => clearAllTimeouts(), [clearAllTimeouts]);

  useEffect(() => { setFares(getAllFares(RIDE_INFO.distanceKm, 18)); }, []);

  const activeFare = fares.find(f => f.id === selType);

  // ── BUG FIX: validate inputs & register timeout refs ─────────────────────
  const handleRequest = async () => {
    let hasErr = false;
    if (!pickup.trim()) { setPickupErr(true);  hasErr = true; }
    if (!dropoff.trim()){ setDropoffErr(true); hasErr = true; }
    if (hasErr) return;

    clearAllTimeouts();              // ← cancel any previous ride's timeouts
    setSubmitting(true);

    const result = await requestRide({
      pickup_location: pickup, dropoff_location: dropoff, vehicle_type: selType,
    });
    setRideId(result?.id ?? `RD-${8800 + Math.floor(Math.random() * 100)}`);
    setSubmitting(false);
    setState("searching");

    // ── Realistic staged ride lifecycle ──────────────────────────────────────
    timeoutsRef.current = [
      setTimeout(() => setState("found"),       3000),   // driver accepted
      setTimeout(() => setState("en_route"),    6000),   // driver departing
      setTimeout(() => setState("in_progress"), 11000),  // ride underway
      setTimeout(() => {
        setState("completed");
        setShowRate(true);
        electronNotify.rideCompleted({ fare: activeFare?.finalFare ?? 0 });
      }, 19000),                                          // arrived
    ];
  };

  const resetRide = () => {
    clearAllTimeouts();
    setState("idle");
    setPickup("");
    setDropoff("");
    setPickupErr(false);
    setDropoffErr(false);
    setRideId(null);
  };

  const isIdle      = state === "idle";
  const isCompleted = state === "completed";
  const showRoute   = ["en_route","in_progress","completed"].includes(state);
  const showDriver  = ["found","en_route","in_progress","completed"].includes(state);
  const statusInfo  = STATES[state];

  return (
    <div style={{ display:"flex", height:"100vh" }}>

      {/* ── MAP AREA ──────────────────────────────────────────────────────── */}
      <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
        <LiveMap showRoute={showRoute} showRider showDriver={showDriver}/>

        {/* Status floating pill */}
        {!isIdle && (
          <div style={{
            position:"absolute", top:16, left:"50%", transform:"translateX(-50%)",
            backdropFilter:"blur(20px) saturate(180%)", background:"rgba(10,15,30,0.78)",
            border:"1px solid var(--b2)", borderRadius:100,
            padding:"10px 22px", display:"flex", alignItems:"center", gap:10,
            boxShadow:"var(--sh-card)",
          }} className="animate-fade-up">
            <div style={{
              width:8, height:8, borderRadius:"50%",
              background:statusInfo?.color,
              boxShadow:`0 0 12px ${statusInfo?.color}`,
              animation:"pulse-dot 1.6s ease infinite",
            }}/>
            <span style={{ fontSize:13, fontWeight:600 }}>{statusInfo?.label}</span>
            {rideId && (
              <span style={{
                fontSize:10, color:"var(--t4)", fontFamily:"var(--font-m)",
                background:"var(--s2)", borderRadius:6, padding:"2px 6px",
              }}>{rideId}</span>
            )}
          </div>
        )}

        {/* Bottom map gradient */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0, height:80, pointerEvents:"none",
          background:"linear-gradient(to top, rgba(10,15,30,0.5), transparent)",
        }}/>
      </div>

      {/* ── SIDE PANEL ────────────────────────────────────────────────────── */}
      <div style={{
        width:360,
        background:"rgba(10,15,30,0.97)",
        borderLeft:"1px solid var(--b1)",
        display:"flex", flexDirection:"column",
        overflow:"hidden",
        backdropFilter:"blur(24px)",
      }}>
        {/* Panel header */}
        <div style={{
          padding:"22px 24px 16px",
          borderBottom:"1px solid var(--b1)",
          background:"linear-gradient(180deg,rgba(59,130,246,0.06),transparent)",
        }}>
          <h2 style={{ fontFamily:"var(--font-d)", fontSize:20, letterSpacing:"-0.02em", marginBottom:2 }}>
            Book a Ride
          </h2>
          <p style={{ fontSize:12, color:"var(--t3)" }}>
            Islamabad / Rawalpindi Metro
          </p>
        </div>

        {/* Scrollable content */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:18 }}>

          {/* ── IDLE: booking form ─────────────────────────────────────── */}
          {isIdle && fares.length > 0 && (
            <>
              {/* Location inputs */}
              <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                {[
                  { ph:"Pickup location",     dot:"var(--blu2)", val:pickup,  set:setPickup,  err:pickupErr,  clrErr:()=>setPickupErr(false) },
                  { ph:"Drop-off destination",dot:"var(--v3)",   val:dropoff, set:setDropoff, err:dropoffErr, clrErr:()=>setDropoffErr(false) },
                ].map((f, i) => (
                  <div key={i} style={{ position:"relative" }}>
                    <div style={{
                      position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
                      width:8, height: i === 0 ? 8 : 6,
                      borderRadius: i === 0 ? "50%" : 2,
                      background:f.dot, zIndex:1,
                    }}/>
                    <input
                      placeholder={f.ph} value={f.val}
                      onChange={e => { f.set(e.target.value); if (f.err) f.clrErr(); }}
                      style={{
                        width:"100%",
                        background: f.err ? "rgba(244,63,94,0.06)" : "var(--s2)",
                        border: `1px solid ${f.err ? "rgba(244,63,94,0.45)" : i === 0 ? "var(--b2)" : "transparent"}`,
                        borderTop: i === 1 ? "1px dashed var(--b1)" : undefined,
                        borderRadius: i === 0 ? "var(--r2) var(--r2) 0 0" : "0 0 var(--r2) var(--r2)",
                        padding:"13px 16px 13px 32px",
                        fontSize:14, color:"var(--t1)", fontFamily:"var(--font-b)",
                        transition:"all 0.18s",
                      }}
                      onFocus={e => {
                        e.target.style.background = "var(--s3)";
                        e.target.style.borderColor = "rgba(59,130,246,0.45)";
                        e.target.style.boxShadow   = "0 0 0 3px rgba(59,130,246,0.1)";
                      }}
                      onBlur={e => {
                        e.target.style.background  = f.err ? "rgba(244,63,94,0.06)" : "var(--s2)";
                        e.target.style.borderColor = f.err ? "rgba(244,63,94,0.45)" : i === 0 ? "var(--b2)" : "transparent";
                        e.target.style.boxShadow   = f.err ? "0 0 0 3px rgba(244,63,94,0.08)" : "none";
                      }}
                    />
                    {f.err && (
                      <p style={{ fontSize:11, color:"#fb7185", padding:"3px 14px 0" }}>
                        This field is required
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Vehicle type selector */}
              <div>
                <p style={{
                  fontSize:10, color:"var(--t4)", textTransform:"uppercase",
                  letterSpacing:"0.1em", fontWeight:700, marginBottom:10,
                }}>Select type</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {TYPES.map(t => {
                    const f   = fares.find(x => x.id === t.id);
                    const sel = selType === t.id;
                    return (
                      <button key={t.id} onClick={() => setSelType(t.id)} style={{
                        display:"flex", alignItems:"center", justifyContent:"space-between",
                        padding:"14px 16px", borderRadius:"var(--r2)", cursor:"pointer",
                        border:`1px solid ${sel ? "rgba(59,130,246,0.45)" : "var(--b1)"}`,
                        background: sel ? "rgba(59,130,246,0.09)" : "var(--s1)",
                        transition:"all 0.18s",
                        boxShadow: sel ? "0 0 0 1px rgba(59,130,246,0.18)" : "none",
                        transform: sel ? "scale(1.01)" : "scale(1)",
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{
                            background: sel ? "rgba(59,130,246,0.15)" : "var(--s2)",
                            borderRadius:10, padding:9,
                            border:`1px solid ${sel ? "rgba(59,130,246,0.3)" : "var(--b1)"}`,
                          }}>
                            <t.icon size={15} color={sel ? "var(--blu2)" : "var(--t3)"}/>
                          </div>
                          <div style={{ textAlign:"left" }}>
                            <div style={{ fontSize:14, fontWeight:700, color: sel ? "var(--t1)" : "var(--t2)" }}>
                              {t.id}
                            </div>
                            <div style={{ fontSize:11, color:"var(--t4)", marginTop:1 }}>
                              {t.desc} · {f?.eta}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{
                            fontSize:16, fontWeight:800,
                            color: sel ? "var(--blu2)" : "var(--t2)",
                            fontFamily:"var(--font-d)",
                          }}>
                            Rs.&nbsp;{f?.finalFare}
                          </div>
                          {f?.surgeApplied && (
                            <div style={{ fontSize:10, color:"var(--amb)", marginTop:2 }}>
                              ⚡ ×{f.multiplier}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fare summary */}
              {activeFare && (
                <div style={{
                  background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(124,62,237,0.06))",
                  border:"1px solid rgba(59,130,246,0.22)",
                  borderRadius:"var(--r2)", padding:"16px 18px",
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:10, color:"var(--t3)", marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                        Estimated fare
                      </div>
                      <div style={{
                        fontSize:30, fontWeight:800, fontFamily:"var(--font-d)",
                        background:"linear-gradient(135deg,var(--blu2),var(--v3))",
                        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                        letterSpacing:"-0.03em",
                      }}>
                        Rs.&nbsp;{activeFare.finalFare}
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11, color:"var(--t3)", marginBottom:4 }}>
                        {RIDE_INFO.distanceKm} km · ~18 min
                      </div>
                      {activeFare.surgeApplied && (
                        <div style={{
                          background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.3)",
                          borderRadius:100, padding:"3px 10px", fontSize:10, color:"#fcd34d",
                        }}>
                          ⚡ {activeFare.surgeLabel} ×{activeFare.multiplier}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Button fullWidth size="lg" onClick={handleRequest} loading={submitting}>
                <Navigation2 size={16}/> Request Cubiny
              </Button>
            </>
          )}

          {/* ── SEARCHING ───────────────────────────────────────────────── */}
          {state === "searching" && (
            <div className="animate-fade-up">
              <LoadingSpinner label="Connecting you with a nearby driver…"/>
            </div>
          )}

          {/* ── ACTIVE RIDE CARD ────────────────────────────────────────── */}
          {!isIdle && state !== "searching" && !isCompleted && (
            <div className="animate-fade-up" style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {/* Driver card */}
              <div style={{
                background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.2)",
                borderRadius:"var(--r3)", padding:20,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14, alignItems:"center" }}>
                  <StatusPill status={
                    state === "in_progress" ? "In Progress"
                    : state === "en_route"  ? "Driver En Route"
                    : "Accepted"
                  }/>
                  <span style={{ fontSize:11, color:"var(--t4)", fontFamily:"var(--font-m)" }}>
                    {rideId ?? RIDE_INFO.id}
                  </span>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  <Avatar initials={DRIVER.avatar} size={50}
                    glow={state === "en_route"} status="online"/>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{DRIVER.name}</div>
                    <div style={{ fontSize:12, color:"var(--t3)", display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                      <Star size={11} color="var(--amb)" fill="var(--amb)"/>
                      {DRIVER.rating} · {DRIVER.vehicle.make} {DRIVER.vehicle.model}
                    </div>
                    <div style={{ fontSize:11, color:"var(--t4)", marginTop:2, fontFamily:"var(--font-m)" }}>
                      {DRIVER.vehicle.plate}
                    </div>
                  </div>
                </div>

                <div style={{ display:"flex", gap:8 }}>
                  <Button variant="secondary" size="sm" style={{ flex:1 }}>
                    <Phone size={13}/> Call
                  </Button>
                  <Button variant="secondary" size="sm" style={{ flex:1 }}>
                    <MessageSquare size={13}/> Chat
                  </Button>
                </div>
              </div>

              {/* Fare row */}
              <div style={{
                display:"flex", justifyContent:"space-between",
                padding:"14px 16px", background:"var(--s1)",
                borderRadius:"var(--r2)", border:"1px solid var(--b1)",
              }}>
                <div>
                  <div style={{ fontSize:10, color:"var(--t4)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Fare</div>
                  <div style={{ fontWeight:800, fontSize:20, fontFamily:"var(--font-d)", color:"var(--blu2)" }}>
                    Rs.&nbsp;{activeFare?.finalFare}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:10, color:"var(--t4)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Distance</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{RIDE_INFO.distanceKm} km</div>
                </div>
                <div>
                  <div style={{ fontSize:10, color:"var(--t4)", textTransform:"uppercase", letterSpacing:"0.06em" }}>Payment</div>
                  <div style={{ fontSize:14, fontWeight:600, color:"var(--grn2)" }}>Wallet</div>
                </div>
              </div>
            </div>
          )}

          {/* ── COMPLETED ───────────────────────────────────────────────── */}
          {isCompleted && (
            <div style={{ textAlign:"center", padding:"28px 0" }} className="animate-bounce-in">
              <div style={{
                width:80, height:80, borderRadius:"50%",
                background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.3)",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 18px", animation:"glowG 2s ease infinite",
              }}>
                <CheckCircle size={38} color="var(--grn2)"/>
              </div>
              <h3 style={{ fontFamily:"var(--font-d)", fontSize:22, marginBottom:6 }}>
                You've arrived! 🎉
              </h3>
              <p style={{ fontSize:13, color:"var(--t3)", marginBottom:8 }}>
                Rs.&nbsp;{activeFare?.finalFare} charged to your wallet
              </p>
              <div style={{ fontSize:11, color:"var(--t4)", fontFamily:"var(--font-m)", marginBottom:24 }}>
                {rideId ?? RIDE_INFO.id}
              </div>
              <Button fullWidth onClick={resetRide}>Book Another Ride</Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Rating Modal ─────────────────────────────────────────────────── */}
      <RatingModal
        open={showRate}
        onClose={() => setShowRate(false)}
        driver={DRIVER}
        fare={activeFare?.finalFare}
      />
    </div>
  );
}
