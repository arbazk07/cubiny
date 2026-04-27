// src/pages/driver/VehiclesPage.jsx  —  Cubiny v2
import { useState } from "react";
import { Car, Zap, Bike, Plus, Check, Upload } from "lucide-react";
import { useAuth }    from "../../hooks/useAuth";
import { Input }      from "../../components/ui/Input";
import { Button }     from "../../components/ui/Button";
import { StatusPill } from "../../components/ui/StatusPill";
import { registerVehicle } from "../../services/mockService";

const TYPES = [
  { id:"Economy", icon:Car,  desc:"Sedan / Hatchback" },
  { id:"Premium", icon:Zap,  desc:"Luxury sedan"      },
  { id:"Bike",    icon:Bike, desc:"Motorbike"          },
];

export function VehiclesPage() {
  const { user }               = useAuth();
  const [vType, setVType]      = useState("Economy");
  const [form,  setForm]       = useState({ make:"", model:"", year:"", color:"", plate:"", cc:"" });
  const [saving,setSaving]     = useState(false);
  const [result,setResult]     = useState(null);
  const upd = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const submit = async () => {
    setSaving(true);
    const res = await registerVehicle({ ...form, type:vType });
    setSaving(false);
    setResult(res);
    setForm({ make:"", model:"", year:"", color:"", plate:"", cc:"" });
  };

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh" }}>
      <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em", marginBottom:24 }}>My Vehicles</h2>

      {/* Registered vehicle */}
      {user?.vehicle && (
        <div style={{ background:"linear-gradient(135deg,rgba(109,40,217,0.1),rgba(8,145,178,0.06))", border:"1px solid rgba(109,40,217,0.2)", borderRadius:"var(--r3)", padding:20, marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ background:"rgba(109,40,217,0.15)", borderRadius:"var(--r2)", padding:12, border:"1px solid rgba(109,40,217,0.25)" }}>
                <Car size={20} color="var(--v3)"/>
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:16 }}>{user.vehicle.make} {user.vehicle.model} {user.vehicle.year}</div>
                <div style={{ fontSize:13, color:"var(--t3)", marginTop:2 }}>{user.vehicle.plate} · {user.vehicle.color} · {user.vehicle.type}</div>
              </div>
            </div>
            <StatusPill status={user.vehicle.verificationStatus}/>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:"var(--r2)", padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
          <Check size={16} color="var(--grn)"/>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#4ade80" }}>Vehicle submitted for review</div>
            <div style={{ fontSize:12, color:"var(--t3)" }}>ID: <span style={{ fontFamily:"var(--font-m)" }}>{result.vehicleId}</span> · Verification takes 24–48 hours</div>
          </div>
        </div>
      )}

      <div className="glass-sm" style={{ padding:24 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:16, marginBottom:20 }}>Register New Vehicle</h3>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
          {[["make","Make / Brand","Toyota, Honda…"],["model","Model","Corolla, Civic…"],["year","Year","2021"],["color","Color","White, Black…"],["plate","License Plate","LEJ-0000"],["cc","Engine CC","1300"]].map(([k,l,ph])=>(
            <Input key={k} label={l} placeholder={ph} value={form[k]} onChange={upd(k)}/>
          ))}
        </div>

        <div style={{ marginBottom:24 }}>
          <p style={{ fontSize:12, color:"var(--t3)", marginBottom:12, fontWeight:500 }}>Vehicle Type</p>
          <div style={{ display:"flex", gap:10 }}>
            {TYPES.map(t=>(
              <button key={t.id} onClick={()=>setVType(t.id)} style={{
                flex:1, padding:"16px 10px", borderRadius:"var(--r2)", cursor:"pointer",
                border:`1px solid ${vType===t.id?"rgba(109,40,217,0.5)":"var(--b1)"}`,
                background: vType===t.id?"rgba(109,40,217,0.1)":"var(--s1)",
                display:"flex", flexDirection:"column", alignItems:"center", gap:8, transition:"all 0.15s",
                boxShadow: vType===t.id ? "var(--sh-v)" : "none",
              }}>
                <t.icon size={20} color={vType===t.id?"var(--v3)":"var(--t3)"}/>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13, fontWeight:600, color:vType===t.id?"var(--v3)":"var(--t2)" }}>{t.id}</div>
                  <div style={{ fontSize:10, color:"var(--t4)", marginTop:1 }}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button fullWidth loading={saving} onClick={submit}>
          <Upload size={15}/> Submit for Verification
        </Button>
      </div>
    </div>
  );
}
