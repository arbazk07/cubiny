// src/pages/rider/HistoryPage.jsx — Cubiny v6
import { useState, useEffect } from 'react';
import { MapPin, Clock, Star, CheckCircle, XCircle } from 'lucide-react';
import { StatusPill }     from '../../components/ui/StatusPill';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { getRideHistory } from '../../services/mockService';

export function HistoryPage() {
  const [rides,   setRides]  = useState([]);
  const [loading, setLoad]   = useState(true);
  const [filter,  setFilter] = useState('All');

  useEffect(() => { getRideHistory().then(r => { setRides(r); setLoad(false); }); }, []);

  const FILTERS = ['All','Completed','Cancelled'];
  const filtered = filter === 'All' ? rides : rides.filter(r => r.status === filter);

  if (loading) return <LoadingSpinner label="Loading ride history…"/>;

  return (
    <div className="page-scroll">
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>My Rides</h1>
        <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:3 }}>{rides.length} trips total</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'7px 16px', borderRadius:99, fontSize:13, fontWeight:600,
            background: filter===f ? 'var(--text-primary)' : 'white',
            color:      filter===f ? 'white' : 'var(--text-secondary)',
            border:     `1px solid ${filter===f ? 'var(--text-primary)' : 'var(--border)'}`,
            cursor:'pointer', transition:'all 0.15s', fontFamily:'var(--font)',
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Ride cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'18px 20px', boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', gap:16, transition:'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
          >
            {/* Status icon */}
            <div style={{
              width:42, height:42, borderRadius:'50%', flexShrink:0,
              background: r.status==='Completed' ? '#F0FDF4' : '#FEF2F2',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {r.status==='Completed'
                ? <CheckCircle size={18} color="#22C55E" strokeWidth={2}/>
                : <XCircle     size={18} color="#EF4444" strokeWidth={2}/>
              }
            </div>

            {/* Route */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                <MapPin size={11} color="#22C55E" strokeWidth={2.2}/>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>{r.from}</span>
                <span style={{ fontSize:10, color:'var(--text-muted)' }}>→</span>
                <MapPin size={11} color="#2563EB" strokeWidth={2.2}/>
                <span style={{ fontSize:12, color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.to}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{r.driver}</span>
                {r.driverRating && (
                  <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, color:'#92400E' }}>
                    <Star size={10} color="#F59E0B" fill="#F59E0B"/>
                    {r.driverRating}
                  </span>
                )}
              </div>
            </div>

            {/* Fare + date */}
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <p style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Rs. {r.fare}</p>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>{r.date}</p>
              <div style={{ marginTop:5 }}><StatusPill status={r.status}/></div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <Clock size={32} style={{ margin:'0 auto 12px', opacity:0.4 }}/>
          <p style={{ fontSize:15, fontWeight:600 }}>No rides found</p>
          <p style={{ fontSize:13, marginTop:4 }}>Your {filter.toLowerCase()} trips will appear here</p>
        </div>
      )}
    </div>
  );
}
