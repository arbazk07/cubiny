// src/pages/rider/WalletPage.jsx  —  Cubiny v2
import { useState, useEffect } from "react";
import { Wallet, DollarSign, Plus, ArrowRight, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button }    from "../../components/ui/Button";
import { Modal }     from "../../components/ui/Modal";
import { Input }     from "../../components/ui/Input";
import { useAuth }   from "../../hooks/useAuth";
import { getWalletTransactions, topUpWallet, saveCard } from "../../services/mockService";

export function WalletPage() {
  const { user }                = useAuth();
  const [txns,      setTxns]    = useState([]);
  const [showCard,  setCard]    = useState(false);
  const [showFunds, setFunds]   = useState(false);
  const [amount,    setAmount]  = useState("");
  const [cardForm,  setCardForm]= useState({ number:"", expiry:"", cvv:"", name:"" });
  const [saving,    setSaving]  = useState(false);
  const [topping,   setTopping] = useState(false);

  useEffect(()=>{ getWalletTransactions(user?.id).then(setTxns); },[user]);

  const handleTopUp = async () => {
    setTopping(true);
    await topUpWallet(user?.id, Number(amount), "Wallet");
    setTopping(false); setFunds(false); setAmount("");
  };

  const handleSaveCard = async () => {
    setSaving(true);
    await saveCard(cardForm);
    setSaving(false); setCard(false);
  };

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh" }}>
      <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em", marginBottom:24 }}>Wallet</h2>

      {/* Balance hero */}
      <div style={{
        background:"linear-gradient(135deg,rgba(109,40,217,0.2),rgba(8,145,178,0.12))",
        border:"1px solid rgba(109,40,217,0.25)", borderRadius:"var(--r4)",
        padding:"32px 28px", marginBottom:20, position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.15),transparent)", pointerEvents:"none" }}/>
        <div style={{ fontSize:12, color:"var(--t3)", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>Available Balance</div>
        <div style={{ fontSize:44, fontWeight:800, fontFamily:"var(--font-d)", background:"linear-gradient(135deg,var(--v3),var(--c3))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.03em", marginBottom:24 }}>
          Rs. {user?.wallet?.toLocaleString()}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <Button size="sm" style={{ gap:6 }} onClick={()=>setFunds(true)}>
            <Plus size={13}/> Add Funds
          </Button>
          <Button variant="secondary" size="sm" style={{ gap:6 }}>
            <ArrowRight size={13}/> Send
          </Button>
        </div>
      </div>

      {/* Payment methods */}
      <div className="glass-sm" style={{ padding:24, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h3 style={{ fontFamily:"var(--font-d)", fontSize:16 }}>Payment Methods</h3>
          <button onClick={()=>setCard(true)} style={{
            background:"var(--s2)", border:"1px solid var(--b2)", borderRadius:"var(--r1)",
            padding:"5px 12px", color:"var(--t2)", fontSize:12, display:"flex", alignItems:"center", gap:5, cursor:"pointer",
          }}>
            <Plus size={11}/> Add Card
          </button>
        </div>
        {[
          { label:"Cubiny Wallet", sub:`Rs. ${user?.wallet?.toLocaleString()}`, icon:Wallet, active:true  },
          { label:"Cash",          sub:"Pay driver directly",                   icon:DollarSign, active:false },
        ].map(m=>(
          <div key={m.label} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"1px solid var(--b1)" }}>
            <div style={{ background:"var(--s2)", borderRadius:"var(--r1)", padding:10, border:"1px solid var(--b1)" }}>
              <m.icon size={15} color="var(--v3)"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500 }}>{m.label}</div>
              <div style={{ fontSize:12, color:"var(--t3)" }}>{m.sub}</div>
            </div>
            {m.active && <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--grn2)", boxShadow:"0 0 10px var(--grn2)" }}/>}
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="glass-sm" style={{ padding:24 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:16, marginBottom:18 }}>Transactions</h3>
        {txns.map((t,i)=>(
          <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 0", borderBottom:"1px solid var(--b1)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{
                width:34, height:34, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                background: t.type==="credit" ? "rgba(34,197,94,0.1)" : "rgba(244,63,94,0.1)",
                border: `1px solid ${t.type==="credit"?"rgba(34,197,94,0.25)":"rgba(244,63,94,0.25)"}`,
              }}>
                {t.type==="credit"
                  ? <ArrowDownLeft size={14} color="#4ade80"/>
                  : <ArrowUpRight  size={14} color="#fb7185"/>
                }
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{t.desc}</div>
                <div style={{ fontSize:11, color:"var(--t4)" }}>{t.date} · {t.method}</div>
              </div>
            </div>
            <span style={{ fontSize:14, fontWeight:700, fontFamily:"var(--font-d)", color: t.type==="credit"?"#4ade80":"#fb7185" }}>
              {t.type==="credit"?"+":"−"} Rs. {t.amount}
            </span>
          </div>
        ))}
      </div>

      {/* Add Card modal */}
      <Modal open={showCard} onClose={()=>setCard(false)} title="Add New Card" subtitle="Your card details are encrypted and secure">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Input label="Card Number" placeholder="1234  5678  9012  3456"
            value={cardForm.number} onChange={e=>setCardForm(p=>({...p,number:e.target.value}))}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Expiry" placeholder="MM / YY"
              value={cardForm.expiry} onChange={e=>setCardForm(p=>({...p,expiry:e.target.value}))}/>
            <Input label="CVV" placeholder="•••" type="password"
              value={cardForm.cvv} onChange={e=>setCardForm(p=>({...p,cvv:e.target.value}))}/>
          </div>
          <Input label="Cardholder Name" placeholder="As it appears on your card"
            value={cardForm.name} onChange={e=>setCardForm(p=>({...p,name:e.target.value}))}/>
          <Button fullWidth loading={saving} onClick={handleSaveCard} style={{ marginTop:6 }}>
            <CreditCard size={15}/> Save Card Securely
          </Button>
        </div>
      </Modal>

      {/* Add Funds modal */}
      <Modal open={showFunds} onClose={()=>setFunds(false)} title="Add Funds" subtitle="Top up your Cubiny wallet instantly" maxWidth={380}>
        <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
          {[500,1000,2000,5000].map(a=>(
            <button key={a} onClick={()=>setAmount(String(a))} style={{
              padding:"8px 14px", borderRadius:"var(--r1)", cursor:"pointer",
              border:`1px solid ${amount===String(a)?"var(--v2)":"var(--b1)"}`,
              background: amount===String(a)?"rgba(109,40,217,0.15)":"var(--s1)",
              color: amount===String(a)?"var(--v3)":"var(--t3)", fontSize:13, fontFamily:"var(--font-b)",
            }}>Rs. {a}</button>
          ))}
        </div>
        <Input type="number" placeholder="Or enter custom amount…"
          value={amount} onChange={e=>setAmount(e.target.value)} style={{ marginBottom:16 }}/>
        <Button fullWidth loading={topping} onClick={handleTopUp} disabled={!amount||Number(amount)<=0}>
          Add Rs. {amount||"0"}
        </Button>
      </Modal>
    </div>
  );
}
