// src/pages/driver/DriverDashboard.jsx — Cubiny Desktop v4
// Adds native OS notifications + tray sync for incoming rides.
import { useState, useEffect, useRef } from "react";
import { Shield, DollarSign, TrendingUp, Car, Star, CheckCircle, XCircle } from "lucide-react";
import { useAuth }        from "../../hooks/useAuth";
import { Avatar }         from "../../components/ui/Avatar";
import { StatCard }       from "../../components/ui/StatCard";
import { Button }         from "../../components/ui/Button";
import { StatusPill }     from "../../components/ui/StatusPill";
import { MOCK_EARNINGS_CHART, MOCK_INCOMING_RIDE } from "../../data/mockData";
import { setDriverAvailability, acceptRide as svcAccept, declineRide as svcDecline } from "../../services/mockService";
import { checkDriverRatingTrigger } from "../../services/ratingService";
import { electronNotify, electronDriver, IS_ELECTRON } from "../../hooks/useElectron";

export function DriverDashboard() {
  const { user }                     = useAuth();
  const [isOnline,  setIsOnline]     = useState(false);
  const [showReq,   setShowReq]      = useState(false);
  const [activeRide,setActiveRide]   = useState(null);
  const [countdown, setCountdown]    = useState(30);
  const [toggling,  setToggling]     = useState(false);
  const trayCleanup = useRef(null);

  const { isFlagged } = checkDriverRatingTrigger(user?.rating ?? 5);
  const maxEarning = Math.max(...MOCK_EARNINGS_CHART.map(e => e.amount));

  // ── Sync tray menu with driver status ─────────────────────────
  useEffect(() => {
    electronDriver.setStatus(isOnline);
  }, [isOnline]);

  // ── Listen for tray "Go Online/Offline" toggle ────────────────
  useEffect(() => {
    const cleanup = electronDriver.onTrayToggle(() => {
      handleToggle();
    });
    trayCleanup.current = cleanup;
    return () => { if (trayCleanup.current) trayCleanup.current(); };
  }, [isOnline]);

  // ── Simulate incoming ride push ───────────────────────────────
  useEffect(() => {
    if (!isOnline) { setShowReq(false); return; }
    const t = setTimeout(() => {
      setShowReq(true);
      // 🔔 Native OS notification
      electronNotify.incomingRide({
        rider: MOCK_INCOMING_RIDE.rider,
        fare:  MOCK_INCOMING_RIDE.fare,
        from:  MOCK_INCOMING_RIDE.from,
        to:    MOCK_INCOMING_RIDE.to,
      });
    }, 3500);
    return () => clearTimeout(t);
  }, [isOnline]);

  // ── Countdown ─────────────────────────────────────────────────
  useEffect(() => {
    if (!showReq) { setCountdown(30); return; }
    if (countdown <= 0) { setShowReq(false); return; }
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [showReq, countdown]);

  const handleToggle = async () => {
    setToggling(true);
    const next = !isOnline;
    await setDriverAvailability(next ? "Online" : "Offline");
    setIsOnline(next);
    if (!next) setActiveRide(null);
    setToggling(false);
  };

  const handleAccept = async () => {
    await svcAccept(MOCK_INCOMING_RIDE.id);
    setActiveRide(MOCK_INCOMING_RIDE);
    setShowReq(false);
    electronNotify.send({ title:"✅ Ride Accepted", body:`Heading to ${MOCK_INCOMING_RIDE.from}`, urgency:"normal" });
  };

  const handleDecline = async () => {
    await svcDecline(MOCK_INCOMING_RIDE.id);
    setShowReq(false); setCountdown(30);
  };

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh", display:"flex", flexDirection:"column", gap:22 }}>

      {/* Header */}
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between" }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-d)",fontSize:22,letterSpacing:"-0.02em" }}>Driver Hub</h2>
          <p style={{ fontSize:12,color:"var(--t3)",marginTop:3 }}>
            {user?.vehicle?.make} {user?.vehicle?.model} · {user?.vehicle?.plate}
            {IS_ELECTRON && <span style={{ marginLeft:8,fontSize:10,color:"var(--blu3)",fontFamily:"var(--font-m)" }}>● Desktop</span>}
          </p>
        </div>
        {user?.verified && (
          <div style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:100,padding:"7px 14px" }}>
            <Shield size={12} color="var(--grn2)"/><span style={{ fontSize:12,color:"#4ade80",fontWeight:600 }}>Verified</span>
          </div>
        )}
      </div>

      {/* Flag warning */}
      {isFlagged && (
        <div style={{ background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.25)",borderRadius:"var(--r2)",padding:"14px 18px",display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ fontSize:20 }}>⚠️</div>
          <div>
            <div style={{ fontWeight:600,color:"#fb7185",fontSize:14,marginBottom:2 }}>Account Flagged</div>
            <div style={{ fontSize:12,color:"var(--t3)" }}>Your average rating is below 3.5★. Admin has been automatically notified.</div>
          </div>
        </div>
      )}

      {/* Online toggle */}
      <div className="glass-sm" style={{ padding:24 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"var(--font-d)",fontSize:20,marginBottom:4,letterSpacing:"-0.02em" }}>
              {isOnline ? <span style={{ color:"#4ade80" }}>You're Live</span> : <span style={{ color:"var(--t3)" }}>You're Offline</span>}
            </div>
            <p style={{ fontSize:13,color:"var(--t3)" }}>
              {isOnline ? "Receiving rides · Synced with system tray" : "Toggle to start accepting rides"}
            </p>
          </div>
          <button onClick={handleToggle} disabled={toggling} style={{
            position:"relative",width:76,height:40,borderRadius:100,border:"none",cursor:"pointer",
            background: isOnline ? "linear-gradient(135deg,#15803d,#22c55e)" : "var(--s3)",
            transition:"all 0.35s",animation: isOnline ? "glowG 2.5s ease infinite" : "none",
            opacity: toggling ? 0.7 : 1,
          }}>
            <div style={{
              position:"absolute",top:5,left:isOnline?40:5,width:30,height:30,borderRadius:"50%",
              background:"#fff",transition:"left 0.3s cubic-bezier(0.4,0,0.2,1)",boxShadow:"0 2px 8px rgba(0,0,0,0.3)",
            }}/>
          </button>
        </div>
        {isOnline && (
          <div style={{ marginTop:14,paddingTop:14,borderTop:"1px solid var(--b1)",display:"flex",gap:20 }}>
            {[["Status","Online"],["Tray","Synced ✓"],["Notifications", IS_ELECTRON ? "Active" : "Web only"]].map(([l,v])=>(
              <div key={l}>
                <div style={{ fontSize:10,color:"var(--t4)",textTransform:"uppercase",letterSpacing:"0.06em" }}>{l}</div>
                <div style={{ fontSize:13,fontWeight:600,fontFamily:"var(--font-d)",color:"var(--t2)" }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12 }}>
        <StatCard icon={DollarSign} label="This Week" value={`Rs. ${user?.weeklyEarnings?.toLocaleString()}`} color="green" trend={12}/>
        <StatCard icon={TrendingUp} label="All Time"  value={`Rs. ${user?.earnings?.toLocaleString()}`}       color="blue"/>
        <StatCard icon={Car}        label="Trips"     value={String(user?.totalTrips)}                        color="cyan" trend={5}/>
        <StatCard icon={Star}       label="Rating"    value={`${user?.rating}★`}                             color="amber"/>
      </div>

      {/* Earnings chart */}
      <div className="glass-sm" style={{ padding:24 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <h3 style={{ fontFamily:"var(--font-d)",fontSize:16 }}>Weekly Earnings</h3>
          <span style={{ fontSize:12,color:"var(--t4)",fontFamily:"var(--font-m)" }}>Rs. {user?.weeklyEarnings?.toLocaleString()}</span>
        </div>
        <div style={{ display:"flex",alignItems:"flex-end",gap:6,height:100 }}>
          {MOCK_EARNINGS_CHART.map((e,i) => (
            <div key={e.day} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}>
              <div style={{
                width:"100%",borderRadius:"5px 5px 0 0",
                height:`${(e.amount/maxEarning)*80}px`,
                background: i===4 ? "linear-gradient(180deg,var(--blu2),var(--blu))" : `rgba(59,130,246,${0.12+i*0.04})`,
                boxShadow: i===4 ? "var(--sh-blu)" : "none",
                transition:"height 0.8s cubic-bezier(0.4,0,0.2,1)",transitionDelay:`${i*0.06}s`,
              }}/>
              <div style={{ fontSize:10,color:i===4?"var(--v3)":"var(--t4)",fontWeight:i===4?700:400 }}>{e.day}</div>
            </div>
          ))}
        </div>
      </div>

      {activeRide && (
        <div className="glass-v animate-fade-up" style={{ padding:20 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <h3 style={{ fontFamily:"var(--font-d)",fontSize:15 }}>Active Ride</h3>
            <StatusPill status="In Progress"/>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,color:"var(--t2)" }}>
            <span>{activeRide.rider}</span><span>Rs. {activeRide.fare}</span><span>{activeRide.distanceKm} km</span>
          </div>
        </div>
      )}

      {/* Incoming ride overlay */}
      {showReq && (
        <div style={{
          position:"fixed",inset:0,zIndex:999,
          display:"flex",alignItems:"center",justifyContent:"center",
          background:"rgba(2,2,16,0.85)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",
        }}>
          <div className="glass animate-bounce-in" style={{ width:"100%",maxWidth:400,margin:20,overflow:"hidden" }}>
            <div style={{ background:"linear-gradient(135deg,var(--v),var(--c))",padding:"22px 26px",position:"relative" }}>
              {/* SVG countdown ring */}
              <svg width="44" height="44" style={{ position:"absolute",top:10,right:10 }}>
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5"/>
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5"
                  strokeDasharray={`${(countdown/30)*113} 113`} strokeLinecap="round"
                  transform="rotate(-90 22 22)" style={{ transition:"stroke-dasharray 1s linear" }}/>
                <text x="22" y="27" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="DM Sans">{countdown}</text>
              </svg>
              <div style={{ fontSize:10,color:"rgba(255,255,255,0.7)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.1em" }}>
                {IS_ELECTRON ? "🔔 New Ride (Desktop)" : "New Ride Request"}
              </div>
              <div style={{ fontSize:32,fontWeight:800,color:"#fff",fontFamily:"var(--font-d)",letterSpacing:"-0.02em" }}>
                Rs. {MOCK_INCOMING_RIDE.fare}
              </div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,0.7)",marginTop:4 }}>
                {MOCK_INCOMING_RIDE.distanceKm} km · {MOCK_INCOMING_RIDE.driverEta}
              </div>
            </div>
            <div style={{ padding:24 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:20 }}>
                <Avatar initials="FZ" size={48}/>
                <div>
                  <div style={{ fontWeight:700,fontSize:15 }}>{MOCK_INCOMING_RIDE.rider}</div>
                  <div style={{ fontSize:12,color:"var(--t3)",display:"flex",alignItems:"center",gap:4,marginTop:2 }}>
                    <Star size={11} color="var(--amb)" fill="var(--amb)"/> {MOCK_INCOMING_RIDE.riderRating} rating
                  </div>
                </div>
              </div>
              {[{label:"Pickup",val:MOCK_INCOMING_RIDE.from,dot:"var(--c2)"},{label:"Drop-off",val:MOCK_INCOMING_RIDE.to,dot:"var(--v2)"}].map(r=>(
                <div key={r.label} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:"var(--s1)",borderRadius:"var(--r2)",marginBottom:8,border:"1px solid var(--b1)" }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:r.dot,flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:10,color:"var(--t4)" }}>{r.label}</div>
                    <div style={{ fontSize:13,fontWeight:500 }}>{r.val}</div>
                  </div>
                </div>
              ))}
              <div style={{ display:"flex",gap:10,marginTop:18 }}>
                <Button variant="danger"  style={{ flex:1 }} onClick={handleDecline}><XCircle  size={15}/> Decline</Button>
                <Button variant="primary" style={{ flex:1 }} onClick={handleAccept}><CheckCircle size={15}/> Accept</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
