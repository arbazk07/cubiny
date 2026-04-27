// src/pages/rider/RatingsPage.jsx  —  Cubiny v2
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Avatar }           from "../../components/ui/Avatar";
import { LoadingSpinner }   from "../../components/ui/LoadingSpinner";
import { useAuth }          from "../../hooks/useAuth";
import { getUserRatings }   from "../../services/mockService";
import { computeAverageRating, getRatingMeta } from "../../services/ratingService";

export function RatingsPage() {
  const { user }            = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoad]    = useState(true);

  useEffect(()=>{ getUserRatings(user?.id).then(d=>{ setRatings(d); setLoad(false); }); },[user]);

  if (loading) return <LoadingSpinner label="Loading ratings…"/>;

  const avg  = computeAverageRating(ratings);
  const meta = getRatingMeta(avg);

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh" }}>
      <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em", marginBottom:24 }}>My Ratings</h2>

      {/* Summary card */}
      <div style={{ background:"linear-gradient(135deg,rgba(109,40,217,0.12),rgba(8,145,178,0.08))", border:"1px solid rgba(109,40,217,0.2)", borderRadius:"var(--r4)", padding:"32px 28px", marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:72, fontWeight:800, fontFamily:"var(--font-d)", color:meta.color, letterSpacing:"-0.04em", lineHeight:1 }}>{avg}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, margin:"14px 0 8px" }}>
          {[1,2,3,4,5].map(s=>(
            <Star key={s} size={22} color="var(--amb)" fill={s<=Math.round(avg)?"var(--amb)":"transparent"}/>
          ))}
        </div>
        <div style={{ display:"inline-block", background:"rgba(109,40,217,0.12)", border:"1px solid rgba(109,40,217,0.25)", borderRadius:100, padding:"4px 14px", fontSize:12, color:meta.color, fontWeight:600 }}>
          {meta.label}
        </div>
        <p style={{ fontSize:13, color:"var(--t3)", marginTop:10 }}>Based on {ratings.length} rides</p>

        {/* Bar chart of star distribution */}
        <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:5 }}>
          {[5,4,3,2,1].map(s=>{
            const count = ratings.filter(r=>r.score===s).length;
            const pct   = ratings.length ? (count/ratings.length)*100 : 0;
            return (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:11, color:"var(--t3)", width:6 }}>{s}</span>
                <Star size={9} color="var(--amb)" fill="var(--amb)"/>
                <div style={{ flex:1, height:5, background:"var(--s2)", borderRadius:3 }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,var(--amb),#fbbf24)", borderRadius:3, transition:"width 1s ease" }}/>
                </div>
                <span style={{ fontSize:10, color:"var(--t4)", width:20, textAlign:"right" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review list */}
      <div className="glass-sm" style={{ padding:24 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:15, marginBottom:18 }}>Recent Reviews</h3>
        {ratings.map((r,i)=>(
          <div key={i} style={{ padding:"16px 0", borderBottom:"1px solid var(--b1)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Avatar initials={r.from.split(" ").map(n=>n[0]).join("")} size={34}/>
                <span style={{ fontWeight:600, fontSize:14 }}>{r.from}</span>
              </div>
              <div style={{ display:"flex", gap:2 }}>
                {[1,2,3,4,5].map(s=>(
                  <Star key={s} size={12} color="var(--amb)" fill={s<=r.score?"var(--amb)":"transparent"}/>
                ))}
              </div>
            </div>
            {r.comment && <p style={{ fontSize:13, color:"var(--t2)", marginLeft:44, lineHeight:1.6 }}>{r.comment}</p>}
            <div style={{ fontSize:11, color:"var(--t4)", marginTop:6, marginLeft:44 }}>{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
