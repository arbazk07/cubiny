// src/pages/admin/AdminPanel.jsx  —  Cubiny v2
import { useState, useEffect } from "react";
import { Activity, DollarSign, Users, Map, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { StatCard }   from "../../components/ui/StatCard";
import { StatusPill } from "../../components/ui/StatusPill";
import { Avatar }     from "../../components/ui/Avatar";
import { Button }     from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { getPlatformStats, getActiveRides, getFlaggedDrivers, getRevenueByMethod, updateDriverStatus } from "../../services/mockService";

export function AdminPanel() {
  const [stats,    setStats]   = useState(null);
  const [rides,    setRides]   = useState([]);
  const [flagged,  setFlagged] = useState([]);
  const [revenue,  setRevenue] = useState([]);
  const [loading,  setLoad]    = useState(true);
  const [updating, setUpdating]= useState(null);

  useEffect(()=>{
    Promise.all([
      getPlatformStats(),
      getActiveRides(),
      getFlaggedDrivers(),
      getRevenueByMethod(),
    ]).then(([s,r,f,rv])=>{ setStats(s); setRides(r); setFlagged(f); setRevenue(rv); setLoad(false); });
  },[]);

  const handleSuspend = async (driverId) => {
    setUpdating(driverId);
    await updateDriverStatus(driverId, "Suspended");
    setFlagged(prev=>prev.map(d=>d.id===driverId?{...d,accountStatus:"Suspended"}:d));
    setUpdating(null);
  };

  if (loading) return <LoadingSpinner label="Loading Mission Control…"/>;

  const maxRev = Math.max(...rides.map(r=>r.fare));

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh", display:"flex", flexDirection:"column", gap:22 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em" }}>Mission Control</h2>
          <p style={{ fontSize:12, color:"var(--t3)", marginTop:3 }}>Live platform overview · {new Date().toLocaleDateString("en-PK",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:100, padding:"8px 16px" }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--grn)", animation:"ping-sm 1.5s ease-out infinite" }}/>
          <span style={{ fontSize:12, color:"#4ade80", fontWeight:600 }}>Live</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
        <StatCard icon={DollarSign} label="Total Revenue"  value={`Rs. ${(stats.totalRevenue/1000).toFixed(0)}K`}   color="green"  trend={8}/>
        <StatCard icon={Activity}   label="Active Rides"   value={String(stats.activeRides)}                        color="cyan"   trend={15}/>
        <StatCard icon={Users}      label="Drivers"        value={stats.registeredDrivers.toLocaleString()}         color="violet" />
        <StatCard icon={Users}      label="Riders"         value={stats.registeredRiders.toLocaleString()}          color="amber"  trend={22}/>
        <StatCard icon={DollarSign} label="Today"          value={`Rs. ${(stats.todayRevenue/1000).toFixed(1)}K`}  color="cyan"   />
      </div>

      {/* Live rides */}
      <div className="glass-sm" style={{ padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <h3 style={{ fontFamily:"var(--font-d)", fontSize:16 }}>Live Rides</h3>
            <p style={{ fontSize:12, color:"var(--t3)", marginTop:2 }}>{rides.length} active now</p>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["All","In Progress","Requested"].map(f=>(
              <button key={f} style={{ padding:"5px 10px", borderRadius:"var(--r1)", border:"1px solid var(--b1)", background:"var(--s1)", color:"var(--t3)", fontSize:11, cursor:"pointer", fontFamily:"var(--font-b)" }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {rides.map(ride=>(
            <div key={ride.id} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"14px 16px", background:"var(--s1)", borderRadius:"var(--r2)", border:"1px solid var(--b1)",
              transition:"border-color 0.15s",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ background:"rgba(109,40,217,0.1)", borderRadius:8, padding:8, border:"1px solid rgba(109,40,217,0.2)" }}>
                  <Map size={13} color="var(--v3)"/>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{ride.rider} → {ride.driver}</div>
                  <div style={{ fontSize:11, color:"var(--t4)", marginTop:1 }}>{ride.from} → {ride.to}</div>
                  {ride.surgeApplied && (
                    <div style={{ fontSize:10, color:"var(--amb)", marginTop:1 }}>⚡ Surge ×{ride.surgeMultiplier} applied</div>
                  )}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
                <StatusPill status={ride.status}/>
                <span style={{ fontSize:11, color:"var(--t4)", fontFamily:"var(--font-m)" }}>
                  Rs. {ride.fare} · {ride.elapsedTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged drivers */}
      <div className="glass-sm" style={{ padding:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div>
            <h3 style={{ fontFamily:"var(--font-d)", fontSize:16 }}>Flagged Drivers</h3>
            <p style={{ fontSize:12, color:"var(--t3)", marginTop:2 }}>Auto-flagged by rating trigger (below 3.5★)</p>
          </div>
          <AlertTriangle size={15} color="var(--amb)"/>
        </div>
        {flagged.length===0 ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 0", color:"var(--t4)", fontSize:13 }}>
            <CheckCircle size={15} color="var(--grn)"/> All drivers rated above threshold
          </div>
        ):(
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {flagged.map(d=>(
              <div key={d.id} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"14px 16px", background:"rgba(245,158,11,0.05)",
                borderRadius:"var(--r2)", border:"1px solid rgba(245,158,11,0.18)",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <Avatar initials={d.name.split(" ").map(n=>n[0]).join("")} size={38}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{d.name}</div>
                    <div style={{ fontSize:11, color:"var(--t4)", marginTop:1 }}>
                      <span style={{ fontFamily:"var(--font-m)" }}>{d.id}</span> · {d.trips} trips
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:"#fb7185" }}>★ {d.rating}</div>
                    <div style={{ fontSize:10, color:"var(--t4)" }}>{d.issue}</div>
                  </div>
                  <Button variant="danger" size="sm" loading={updating===d.id}
                    onClick={()=>handleSuspend(d.id)} disabled={d.accountStatus==="Suspended"}>
                    {d.accountStatus==="Suspended"?"Suspended":"Suspend"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue by method */}
      <div className="glass-sm" style={{ padding:24 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:16, marginBottom:20 }}>Revenue by Payment Method</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {revenue.map((r,i)=>(
            <div key={r.method}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:r.color }}/>
                  <span>{r.method}</span>
                </div>
                <span style={{ fontWeight:700, fontFamily:"var(--font-m)", color:"var(--t1)" }}>{r.pct}%</span>
              </div>
              <div style={{ height:6, borderRadius:6, background:"var(--s2)" }}>
                <div style={{
                  height:"100%", borderRadius:6, width:`${r.pct}%`,
                  background: i===0 ? "linear-gradient(90deg,var(--v),var(--v2))"
                            : i===1 ? "linear-gradient(90deg,var(--c),var(--c2))"
                            : "linear-gradient(90deg,#d97706,#f59e0b)",
                  transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)",
                  transitionDelay:`${i*0.15}s`,
                }}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid var(--b1)", display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--t3)" }}>
          <span>Total platform revenue</span>
          <span style={{ fontWeight:700, fontFamily:"var(--font-d)", color:"var(--grn)", fontSize:14 }}>Rs. {stats.totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
