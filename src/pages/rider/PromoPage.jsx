// src/pages/rider/PromoPage.jsx — Cubiny v6
import { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Input }          from '../../components/ui/Input';
import { Button }         from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { getUserPromoCodes, applyPromoCode } from '../../services/mockService';

export function PromoPage() {
  const [codes,   setCodes]   = useState([]);
  const [loading, setLoad]    = useState(true);
  const [code,    setCode]    = useState('');
  const [applying,setApplying]= useState(false);
  const [result,  setResult]  = useState(null);

  useEffect(() => { getUserPromoCodes().then(c => { setCodes(c); setLoad(false); }); }, []);

  const handleApply = async () => {
    if (!code.trim()) return;
    setApplying(true); setResult(null);
    try {
      const r = await applyPromoCode(code);
      setResult({ ok:true, msg:`Code applied! ${r.discount} off your next ride.` });
      setCode('');
    } catch (e) {
      setResult({ ok:false, msg:e.message });
    }
    setApplying(false);
  };

  if (loading) return <LoadingSpinner label="Loading promotions…"/>;

  return (
    <div className="page-scroll">
      <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em', marginBottom:24 }}>Promotions</h1>

      {/* Apply code */}
      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'20px', marginBottom:20, boxShadow:'var(--shadow-sm)' }}>
        <p style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', marginBottom:14 }}>Have a promo code?</p>
        <div style={{ display:'flex', gap:10 }}>
          <Input placeholder="Enter code e.g. CUBINY50" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} style={{ textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}/>
          <Button variant="primary" onClick={handleApply} loading={applying} style={{ flexShrink:0 }}>Apply</Button>
        </div>
        {result && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, padding:'10px 14px', borderRadius:'var(--r-lg)', background:result.ok?'#F0FDF4':'#FEF2F2', border:`1px solid ${result.ok?'#BBF7D0':'#FECACA'}` }}>
            {result.ok ? <CheckCircle size={13} color="#22C55E"/> : <AlertCircle size={13} color="#EF4444"/>}
            <span style={{ fontSize:13, color:result.ok?'#16A34A':'#DC2626', fontWeight:500 }}>{result.msg}</span>
          </div>
        )}
      </div>

      {/* Promo cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
        {codes.map(c => (
          <div key={c.code} style={{ background:c.isUsed?'var(--bg-subtle)':'white', border:`1px solid ${c.isUsed?'var(--border)':'#BBF7D0'}`, borderRadius:'var(--r-xl)', padding:'20px', boxShadow:c.isUsed?'none':'var(--shadow-sm)', opacity:c.isUsed?0.6:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:'var(--r-lg)', background:c.isUsed?'var(--border)':'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Gift size={18} color={c.isUsed?'var(--text-muted)':'#22C55E'} strokeWidth={2}/>
              </div>
              {c.isUsed
                ? <span style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', background:'var(--border)', borderRadius:99, padding:'3px 8px' }}>Used</span>
                : <span style={{ fontSize:11, fontWeight:600, color:'#16A34A', background:'#DCFCE7', borderRadius:99, padding:'3px 8px' }}>Active</span>
              }
            </div>
            <p style={{ fontSize:20, fontWeight:900, color:c.isUsed?'var(--text-muted)':'var(--text-primary)', letterSpacing:'0.06em', fontFamily:'monospace', marginBottom:4 }}>{c.code}</p>
            <p style={{ fontSize:15, fontWeight:700, color:c.isUsed?'var(--text-muted)':'#16A34A', marginBottom:6 }}>{c.discount}</p>
            <p style={{ fontSize:11, color:'var(--text-muted)' }}>Expires {c.expiry}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
