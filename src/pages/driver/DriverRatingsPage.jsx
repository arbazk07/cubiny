// src/pages/driver/DriverRatingsPage.jsx  —  Cubiny v2
import { useState, useEffect } from "react";
import { Star, AlertTriangle } from "lucide-react";
import { Avatar }           from "../../components/ui/Avatar";
import { LoadingSpinner }   from "../../components/ui/LoadingSpinner";
import { useAuth }          from "../../hooks/useAuth";
import { getUserRatings }   from "../../services/mockService";
import { computeAverageRating, checkDriverRatingTrigger, getRatingMeta } from "../../services/ratingService";

export function DriverRatingsPage() {
  const { user }              = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoad]    = useState(true);
  useEffect(()=>{ getUserRatings(user?.id).then(d=>{ setRatings(d); setLoad(false); }); },[user]);
  if (loading) return <LoadingSpinner label="Loading ratings…"/>;
  const avg       = computeAverageRating(ratings);
  const { isFlagged } = checkDriverRatingTrigger(avg);
  const meta      = getRatingMeta(avg);

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh" }}>
      <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em", marginBottom:24 }}>My Ratings</h2>

      {isFlagged && (
        <div style={{ background:"rgba(244,63,94,0.08)", border:"1px solid rgba(244,63,94,0.25)", borderRadius:"var(--r2)", padding:"14px 18px", marginBottom:20, display:"flex", gap:12 }}>
          <AlertTriangle size={18} color="var(--red)" style={{ flexShrink:0, marginTop:1 }}/>
          <div>
            <div style={{ fontWeight:600, color:"#fb7185", fontSize:14, marginBottom:2 }}>Rating Below Threshold</div>
            <div style={{ fontSize:12, color:"var(--t3)" }}>Average {avg}★ is below 3.5★. Your account is flagged for admin review. Improve your service to resolve this.</div>
          </div>
        </div>
      )}

      <div style={{ background:`linear-gradient(135deg,rgba(109,40,217,0.1),rgba(8,145,178,0.06))`, border:"1px solid rgba(109,40,217,0.2)", borderRadius:"var(--r4)", padding:"32px 28px", marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:72, fontWeight:800, fontFamily:"var(--font-d)", color:meta.color, letterSpacing:"-0.04em", lineHeight:1 }}>{avg}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, margin:"12px 0 8px" }}>
          {[1,2,3,4,5].map(s=><Star key={s} size={22} color="var(--amb)" fill={s<=Math.round(avg)?"var(--amb)":"transparent"}/>)}
        </div>
        <div style={{ fontSize:14, color:meta.color, fontWeight:600 }}>{meta.label}</div>
        <p style={{ fontSize:12, color:"var(--t4)", marginTop:6 }}>{ratings.length} reviews · Keep it above 3.5 to stay active</p>
      </div>

      <div className="glass-sm" style={{ padding:24 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:15, marginBottom:18 }}>Rider Reviews</h3>
        {ratings.map((r,i)=>(
          <div key={i} style={{ padding:"16px 0", borderBottom:"1px solid var(--b1)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Avatar initials={r.from.split(" ").map(n=>n[0]).join("")} size={34}/>
                <span style={{ fontWeight:600, fontSize:14 }}>{r.from}</span>
              </div>
              <div style={{ display:"flex", gap:2 }}>
                {[1,2,3,4,5].map(s=><Star key={s} size={12} color="var(--amb)" fill={s<=r.score?"var(--amb)":"transparent"}/>)}
              </div>
            </div>
            {r.comment && <p style={{ fontSize:13, color:"var(--t2)", marginLeft:44, lineHeight:1.6 }}>{r.comment}</p>}
            <div style={{ fontSize:11, color:"var(--t4)", marginTop:5, marginLeft:44 }}>{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
