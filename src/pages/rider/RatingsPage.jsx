// src/pages/rider/RatingsPage.jsx — Cubiny v6
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Avatar }         from '../../components/ui/Avatar';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { getUserRatings } from '../../services/mockService';
import { useAuth }        from '../../hooks/useAuth';

function StarRow({ score }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} color="#F59E0B" fill={i<=score?'#F59E0B':'transparent'} strokeWidth={1.8}/>
      ))}
    </div>
  );
}

export function RatingsPage() {
  const { user }            = useAuth();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoad]    = useState(true);

  useEffect(() => { getUserRatings(user?.id).then(r => { setRatings(r); setLoad(false); }); }, []);

  const avg = ratings.length ? (ratings.reduce((a,r)=>a+r.score,0)/ratings.length).toFixed(1) : '—';
  const dist = [5,4,3,2,1].map(s => ({ s, count:ratings.filter(r=>r.score===s).length }));

  if (loading) return <LoadingSpinner label="Loading ratings…"/>;

  return (
    <div className="page-scroll">
      <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em', marginBottom:24 }}>My Ratings</h1>

      {/* Summary card */}
      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'24px', marginBottom:16, boxShadow:'var(--shadow-sm)', display:'flex', gap:32, alignItems:'center' }}>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontSize:52, fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.04em', lineHeight:1 }}>{avg}</p>
          <div style={{ display:'flex', justifyContent:'center', gap:2, margin:'8px 0 4px' }}>
            {[1,2,3,4,5].map(i=><Star key={i} size={16} color="#F59E0B" fill={i<=Math.round(parseFloat(avg))?'#F59E0B':'transparent'} strokeWidth={1.8}/>)}
          </div>
          <p style={{ fontSize:12, color:'var(--text-muted)' }}>{ratings.length} reviews</p>
        </div>
        <div style={{ flex:1 }}>
          {dist.map(({ s, count }) => {
            const pct = ratings.length ? (count/ratings.length)*100 : 0;
            return (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span style={{ fontSize:12, color:'var(--text-muted)', width:10 }}>{s}</span>
                <Star size={11} color="#F59E0B" fill="#F59E0B"/>
                <div style={{ flex:1, height:6, background:'var(--bg-subtle)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:'#F59E0B', borderRadius:99, transition:'width 0.5s' }}/>
                </div>
                <span style={{ fontSize:11, color:'var(--text-muted)', width:16, textAlign:'right' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual reviews */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {ratings.map((r, i) => (
          <div key={i} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'16px 20px', boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:r.comment?10:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Avatar initials={r.from.slice(0,2)} size={34}/>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{r.from}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>{r.date}</p>
                </div>
              </div>
              <StarRow score={r.score}/>
            </div>
            {r.comment && <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.65, paddingTop:10, borderTop:'1px solid var(--border)' }}>"{r.comment}"</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
