// src/pages/driver/VehiclesPage.jsx — Cubiny v6
import { useState, useEffect } from 'react';
import { Truck, Plus, CheckCircle } from 'lucide-react';
import { Button }         from '../../components/ui/Button';
import { Input }          from '../../components/ui/Input';
import { Modal }          from '../../components/ui/Modal';
import { StatusPill }     from '../../components/ui/StatusPill';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { getVehicles, registerVehicle } from '../../services/mockService';

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading,  setLoad]     = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [result,   setResult]   = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({ make:'', model:'', year:'', plate:'', color:'', type:'Economy' });

  useEffect(() => { getVehicles().then(v => { setVehicles(v); setLoad(false); }); }, []);

  const upd = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleAdd = async () => {
    if (!form.make||!form.model||!form.plate) return;
    setSaving(true);
    const r = await registerVehicle(form);
    setResult(r);
    setVehicles(p => [...p, { ...form, vehicleId:r.vehicleId, verificationStatus:'Pending' }]);
    setSaving(false);
  };

  if (loading) return <LoadingSpinner label="Loading vehicles…"/>;

  return (
    <div className="page-scroll">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>My Vehicle</h1>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}><Plus size={14}/> Add Vehicle</Button>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {vehicles.map((v,i) => (
          <div key={i} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'20px', boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:'var(--r-lg)', background:'#EFF6FF', border:'1px solid #BFDBFE', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Truck size={20} color="#2563EB" strokeWidth={1.8}/>
                </div>
                <div>
                  <p style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{v.make} {v.model}</p>
                  <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:1 }}>{v.year||'2021'} · {v.color||'White'} · {v.type||'Economy'}</p>
                </div>
              </div>
              <StatusPill status={v.verificationStatus||'Verified'}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { label:'Plate No.',  value:v.plate },
                { label:'Vehicle ID', value:v.vehicleId },
                { label:'Type',       value:v.type||'Economy' },
                { label:'Status',     value:v.verificationStatus||'Verified' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background:'var(--bg-subtle)', borderRadius:'var(--r-lg)', padding:'10px 14px' }}>
                  <p style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{label}</p>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', fontFamily:label==='Plate No.'||label==='Vehicle ID'?'monospace':undefined }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={showForm} onClose={()=>{setShowForm(false);setResult(null);}} title="Register Vehicle" subtitle="All vehicles are verified within 24–48 hours">
        {result ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ width:56, height:56, borderRadius:'50%', background:'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <CheckCircle size={26} color="#22C55E" strokeWidth={2}/>
            </div>
            <p style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)', marginBottom:4 }}>Vehicle submitted for review</p>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>ID: <span style={{ fontFamily:'monospace', fontWeight:700, color:'var(--cobalt)' }}>{result.vehicleId}</span></p>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Verification takes 24–48 hours</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Input label="Make" placeholder="e.g. Toyota" value={form.make} onChange={upd('make')}/>
              <Input label="Model" placeholder="e.g. Corolla" value={form.model} onChange={upd('model')}/>
              <Input label="Year" type="number" placeholder="2021" value={form.year} onChange={upd('year')}/>
              <Input label="Color" placeholder="e.g. White" value={form.color} onChange={upd('color')}/>
            </div>
            <Input label="License Plate" placeholder="e.g. LEJ-3421" value={form.plate} onChange={upd('plate')}/>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Vehicle Type</p>
              <div style={{ display:'flex', gap:8 }}>
                {['Economy','Premium','Bike'].map(t => (
                  <button key={t} onClick={() => setForm(p=>({...p,type:t}))} style={{
                    flex:1, padding:'9px 0', borderRadius:'var(--r-lg)',
                    background: form.type===t ? '#EFF6FF' : 'var(--bg-subtle)',
                    border: `1.5px solid ${form.type===t ? '#2563EB' : 'var(--border)'}`,
                    color: form.type===t ? '#1D4ED8' : 'var(--text-secondary)',
                    fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.12s',
                  }}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:4 }}>
              <Button variant="secondary" fullWidth onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="primary"   fullWidth onClick={handleAdd} loading={saving}>Register Vehicle</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
