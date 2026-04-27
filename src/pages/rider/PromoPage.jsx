// src/pages/rider/PromoPage.jsx  —  Cubiny v2
import { useState, useEffect } from "react";
import { Tag, Gift, Check, X, Copy } from "lucide-react";
import { Button }         from "../../components/ui/Button";
import { Input }          from "../../components/ui/Input";
import { useAuth }        from "../../hooks/useAuth";
import { applyPromoCode, getUserPromoCodes } from "../../services/mockService";

export function PromoPage() {
  const { user }             = useAuth();
  const [codes,   setCodes]  = useState([]);
  const [input,   setInput]  = useState("");
  const [result,  setResult] = useState(null); // {type:"success"|"error", msg}
  const [applying,setApply]  = useState(false);

  useEffect(()=>{ getUserPromoCodes(user?.id).then(setCodes); },[user]);

  const apply = async () => {
    setApply(true); setResult(null);
    try {
      const res = await applyPromoCode(input);
      setResult({ type:"success", msg:`${res.discount} applied to your next ride!` });
    } catch(e) {
      setResult({ type:"error", msg: e.message });
    } finally { setApply(false); }
  };

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh" }}>
      <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em", marginBottom:24 }}>Promo Codes</h2>

      {/* Apply input */}
      <div className="glass-sm" style={{ padding:24, marginBottom:20 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:15, marginBottom:4 }}>Have a code?</h3>
        <p style={{ fontSize:13, color:"var(--t3)", marginBottom:16 }}>Enter your promo code below to unlock a discount on your next ride.</p>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1 }}>
            <Input placeholder="e.g. CUBINY50" value={input}
              onChange={e=>{ setInput(e.target.value); setResult(null); }}
              style={{ textTransform:"uppercase", fontFamily:"var(--font-m)", letterSpacing:"0.06em" }}/>
          </div>
          <Button onClick={apply} loading={applying} disabled={!input.trim()}>
            <Tag size={14}/> Apply
          </Button>
        </div>
        {result && (
          <div style={{
            marginTop:12, display:"flex", alignItems:"center", gap:8,
            padding:"10px 14px", borderRadius:"var(--r1)", fontSize:13, fontWeight:500,
            background: result.type==="success"?"rgba(34,197,94,0.1)":"rgba(244,63,94,0.1)",
            border: result.type==="success"?"1px solid rgba(34,197,94,0.3)":"1px solid rgba(244,63,94,0.3)",
            color: result.type==="success"?"#4ade80":"#fb7185",
          }}>
            {result.type==="success"?<Check size={14}/>:<X size={14}/>}
            {result.msg}
          </div>
        )}
      </div>

      {/* Available codes */}
      <div className="glass-sm" style={{ padding:24 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:15, marginBottom:18 }}>Your Offers</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {codes.map(p=>(
            <div key={p.code} style={{
              padding:"16px 18px", borderRadius:"var(--r2)", opacity:p.isUsed?0.45:1,
              background: p.isUsed?"var(--s1)":"linear-gradient(135deg,rgba(109,40,217,0.07),rgba(8,145,178,0.04))",
              border:`1px solid ${p.isUsed?"var(--b1)":"rgba(109,40,217,0.2)"}`,
              display:"flex", alignItems:"center", justifyContent:"space-between",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ background:p.isUsed?"var(--s2)":"rgba(109,40,217,0.15)", borderRadius:"var(--r1)", padding:10, border:`1px solid ${p.isUsed?"var(--b1)":"rgba(109,40,217,0.25)"}` }}>
                  <Gift size={15} color={p.isUsed?"var(--t4)":"var(--v3)"}/>
                </div>
                <div>
                  <div style={{ fontWeight:700, fontFamily:"var(--font-m)", fontSize:15, letterSpacing:"0.05em", color:p.isUsed?"var(--t3)":"var(--t1)" }}>{p.code}</div>
                  <div style={{ fontSize:12, color:"var(--t4)", marginTop:2 }}>{p.discount} · Expires {p.expiry}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                {!p.isUsed && (
                  <button onClick={()=>{ navigator.clipboard?.writeText(p.code); }}
                    style={{ background:"var(--s2)", border:"1px solid var(--b2)", borderRadius:8, padding:7, color:"var(--t3)", cursor:"pointer", display:"flex" }}>
                    <Copy size={12}/>
                  </button>
                )}
                <span style={{
                  padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:600,
                  background: p.isUsed?"var(--s2)":"rgba(34,197,94,0.12)",
                  color:      p.isUsed?"var(--t4)":"#4ade80",
                  border:     p.isUsed?"1px solid var(--b1)":"1px solid rgba(34,197,94,0.3)",
                }}>{p.isUsed?"Used":"Active"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
