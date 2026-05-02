// src/pages/rider/WalletPage.jsx — Cubiny v6
import { useState, useEffect } from 'react';
import { Wallet, Plus, CreditCard, ArrowUpRight, ArrowDownLeft, RotateCcw } from 'lucide-react';
import { Button }               from '../../components/ui/Button';
import { Modal }                from '../../components/ui/Modal';
import { Input }                from '../../components/ui/Input';
import { StatusPill }           from '../../components/ui/StatusPill';
import { LoadingSpinner }       from '../../components/ui/LoadingSpinner';
import { useAuth }              from '../../hooks/useAuth';
import { getWalletTransactions, topUpWallet } from '../../services/mockService';

const METHODS = [
  { id:'jazzcash',  label:'JazzCash',  active:true  },
  { id:'easypaisa', label:'EasyPaisa', active:true  },
  { id:'card',      label:'Debit Card',active:false },
];

export function WalletPage() {
  const { user }                     = useAuth();
  const [txns,    setTxns]           = useState([]);
  const [loading, setLoad]           = useState(true);
  const [showTopUp, setShowTopUp]    = useState(false);
  const [amount,  setAmount]         = useState('');
  const [method,  setMethod]         = useState('jazzcash');
  const [topping, setTopping]        = useState(false);
  const [amtErr,  setAmtErr]         = useState('');

  useEffect(() => { getWalletTransactions().then(t => { setTxns(t); setLoad(false); }); }, []);

  const handleTopUp = async () => {
    const n = parseFloat(amount);
    if (!amount || isNaN(n) || n < 100) { setAmtErr('Minimum top-up is Rs. 100'); return; }
    setTopping(true);
    await topUpWallet(n, method);
    setTopping(false); setShowTopUp(false); setAmount('');
  };

  const TxnIcon = ({ type }) => {
    const cfg = {
      credit: { bg:'#F0FDF4', color:'#22C55E', Icon:ArrowDownLeft },
      debit:  { bg:'#FEF2F2', color:'#EF4444', Icon:ArrowUpRight  },
      refund: { bg:'#EFF6FF', color:'#2563EB', Icon:RotateCcw     },
    }[type] ?? { bg:'#F8FAFC', color:'#94A3B8', Icon:ArrowUpRight };
    return (
      <div style={{ width:38, height:38, borderRadius:'50%', background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <cfg.Icon size={16} color={cfg.color} strokeWidth={2}/>
      </div>
    );
  };

  if (loading) return <LoadingSpinner label="Loading wallet…"/>;

  return (
    <div className="page-scroll">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Wallet</h1>
        <Button variant="primary" size="sm" onClick={() => setShowTopUp(true)}>
          <Plus size={14}/> Top Up
        </Button>
      </div>

      {/* Balance card */}
      <div style={{
        background:'linear-gradient(135deg,#0F172A 0%,#1E293B 100%)',
        borderRadius:'var(--r-2xl)', padding:'28px 28px', marginBottom:20,
        boxShadow:'var(--shadow-xl)', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:180, height:180, borderRadius:'50%', background:'rgba(34,197,94,0.08)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-40, left:-20, width:140, height:140, borderRadius:'50%', background:'rgba(37,99,235,0.06)', pointerEvents:'none' }}/>
        <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Available Balance</p>
        <p style={{ fontSize:38, fontWeight:900, color:'white', letterSpacing:'-0.04em', marginBottom:4 }}>
          Rs. {(user?.wallet ?? 4750).toLocaleString()}
        </p>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Cubiny Wallet · {user?.name}</p>
      </div>

      {/* Payment methods */}
      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'18px 20px', marginBottom:16, boxShadow:'var(--shadow-sm)' }}>
        <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:14 }}>Linked Methods</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {METHODS.map(m => (
            <div key={m.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'var(--bg-subtle)', borderRadius:'var(--r-lg)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'var(--r-md)', background:'white', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <CreditCard size={14} color="var(--text-muted)" strokeWidth={1.8}/>
                </div>
                <span style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>{m.label}</span>
              </div>
              {m.active
                ? <StatusPill status="Active"/>
                : <button style={{ fontSize:11, color:'var(--cobalt)', fontWeight:600, background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font)' }}>Add</button>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>Recent Transactions</p>
        </div>
        {txns.map(t => (
          <div key={t.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px', borderBottom:'1px solid var(--border)', transition:'background 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <TxnIcon type={t.type}/>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.desc}</p>
              <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{t.method} · {t.date}</p>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <p style={{
                fontSize:14, fontWeight:700,
                color: t.type==='debit' ? '#DC2626' : '#16A34A',
              }}>
                {t.type==='debit' ? '−' : '+'} Rs. {t.amount}
              </p>
              <StatusPill status={t.status}/>
            </div>
          </div>
        ))}
      </div>

      {/* Top-up modal */}
      <Modal open={showTopUp} onClose={() => { setShowTopUp(false); setAmount(''); setAmtErr(''); }} title="Top Up Wallet" subtitle="Add funds to your Cubiny wallet">
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <Input label="Amount (PKR)" type="number" placeholder="Minimum Rs. 100"
            value={amount} onChange={e => { setAmount(e.target.value); setAmtErr(''); }} error={amtErr}/>

          <div>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Quick Amounts</p>
            <div style={{ display:'flex', gap:8 }}>
              {[500,1000,2000,5000].map(a => (
                <button key={a} onClick={() => { setAmount(String(a)); setAmtErr(''); }} style={{
                  flex:1, padding:'9px 0', borderRadius:'var(--r-lg)',
                  background: amount===String(a) ? '#F0FDF4' : 'var(--bg-subtle)',
                  border: `1.5px solid ${amount===String(a) ? '#22C55E' : 'var(--border)'}`,
                  fontSize:13, fontWeight:600,
                  color: amount===String(a) ? '#16A34A' : 'var(--text-secondary)',
                  cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.12s',
                }}>
                  {a/1000}K
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Payment Method</p>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {METHODS.filter(m => m.active).map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  display:'flex', alignItems:'center', gap:10, padding:'11px 14px',
                  borderRadius:'var(--r-lg)', cursor:'pointer', fontFamily:'var(--font)',
                  background: method===m.id ? '#EFF6FF' : 'var(--bg-subtle)',
                  border: `1.5px solid ${method===m.id ? '#2563EB' : 'var(--border)'}`,
                  transition:'all 0.12s', textAlign:'left',
                }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${method===m.id ? '#2563EB' : 'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {method===m.id && <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563EB' }}/>}
                  </div>
                  <span style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <Button variant="secondary" fullWidth onClick={() => setShowTopUp(false)}>Cancel</Button>
            <Button variant="primary"   fullWidth onClick={handleTopUp} loading={topping}>
              Add Rs. {amount || '0'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
