// src/pages/rider/HistoryPage.jsx  —  Cubiny v2
import { useState, useEffect } from "react";
import { MapPin, Navigation, ArrowRight, Star, Filter } from "lucide-react";
import { StatusPill }       from "../../components/ui/StatusPill";
import { LoadingSpinner }   from "../../components/ui/LoadingSpinner";
import { useAuth }          from "../../hooks/useAuth";
import { getRideHistory }   from "../../services/mockService";

export function HistoryPage() {
  const { user }            = useAuth();
  const [rides,   setRides] = useState([]);
  const [loading, setLoad]  = useState(true);
  const [filter,  setFilter]= useState("all");

  useEffect(()=>{
    getRideHistory(user?.id).then(data=>{ setRides(data); setLoad(false); });
  },[user]);

  const filtered = filter==="all" ? rides : rides.filter(r=>r.status.toLowerCase()===filter);
  const filters  = ["all","completed","cancelled"];

  if (loading) return <LoadingSpinner label="Loading ride history…"/>;

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em" }}>Ride History</h2>
          <p style={{ fontSize:12, color:"var(--t3)", marginTop:3 }}>{rides.length} total rides</p>
        </div>
        <div style={{ display:"flex", gap:4, background:"var(--s1)", borderRadius:"var(--r2)", padding:4, border:"1px solid var(--b1)" }}>
          {filters.map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:"6px 12px", borderRadius:"var(--r1)", border:"none",
              background: filter===f?"linear-gradient(135deg,var(--v),var(--v2))":"transparent",
              color: filter===f?"#fff":"var(--t3)", fontSize:12, fontWeight:filter===f?600:400,
              cursor:"pointer", fontFamily:"var(--font-b)", transition:"all 0.15s",
            }}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map((r,i)=>(
          <div key={r.id} className="animate-fade-up glass-sm" style={{ padding:20, animationDelay:`${i*0.05}s` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--c2)" }}/>
                  <span style={{ fontSize:14, fontWeight:600 }}>{r.from}</span>
                  <ArrowRight size={11} color="var(--t4)"/>
                  <div style={{ width:8, height:8, borderRadius:2, background:"var(--v2)" }}/>
                  <span style={{ fontSize:14, fontWeight:600 }}>{r.to}</span>
                </div>
                <div style={{ fontSize:11, color:"var(--t4)", marginLeft:16 }}>{r.date}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                <StatusPill status={r.status}/>
                <span style={{ fontSize:14, fontWeight:700, fontFamily:"var(--font-d)", color:"var(--t1)" }}>Rs. {r.fare}</span>
              </div>
            </div>
            {r.driver!=="N/A" && (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:"1px solid var(--b1)" }}>
                <span style={{ fontSize:12, color:"var(--t3)" }}>Driver: {r.driver}</span>
                {r.driverRating && (
                  <div style={{ display:"flex", gap:2 }}>
                    {[1,2,3,4,5].map(s=>(
                      <Star key={s} size={11} color="var(--amb)" fill={s<=r.driverRating?"var(--amb)":"transparent"}/>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:"40px 0", color:"var(--t4)" }}>
            <div style={{ fontSize:32, marginBottom:10 }}>🛺</div>
            <p>No {filter} rides found</p>
          </div>
        )}
      </div>
    </div>
  );
}
