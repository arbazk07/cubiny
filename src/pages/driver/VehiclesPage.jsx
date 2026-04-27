// src/pages/driver/VehiclesPage.jsx
import { useState } from "react";
import { Car, Zap, Bike, Plus, Check } from "lucide-react";
import { useAuth }    from "../../hooks/useAuth";
import { Input }      from "../../components/ui/Input";
import { Button }     from "../../components/ui/Button";
import { StatusPill } from "../../components/ui/StatusPill";

const VEHICLE_TYPES = [
  { id: "Economy", label: "Economy", icon: Car  },
  { id: "Premium", label: "Premium", icon: Zap  },
  { id: "Bike",    label: "Bike",    icon: Bike },
];

const FIELDS = [
  { key: "make",  label: "Make / Brand",   ph: "Toyota, Honda…" },
  { key: "model", label: "Model",          ph: "Corolla, Civic…" },
  { key: "year",  label: "Year",           ph: "2020" },
  { key: "color", label: "Color",          ph: "White, Black…" },
  { key: "plate", label: "License Plate",  ph: "LEJ-0000" },
  { key: "cc",    label: "Engine CC",      ph: "1300" },
];

export function VehiclesPage() {
  const { user }              = useAuth();
  const [vType, setVType]     = useState("Economy");
  const [saved, setSaved]     = useState(false);
  const [form,  setForm]      = useState({});

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submitVehicle = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 24 }}>My Vehicles</h2>

      {/* Registered vehicle */}
      {user?.vehicle && (
        <div className="glass-violet" style={{ padding: 20, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(124,58,237,0.2)", borderRadius: 10, padding: 10 }}>
              <Car size={18} color="var(--clr-violet-3)" />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>
                {user.vehicle.make} {user.vehicle.model} {user.vehicle.year}
              </div>
              <div style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>
                {user.vehicle.plate} · {user.vehicle.color}
              </div>
            </div>
          </div>
          <StatusPill status={user.vehicle.verificationStatus} />
        </div>
      )}

      {/* Registration form */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 20 }}>Register New Vehicle</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {FIELDS.map((f) => (
            <Input
              key={f.key}
              label={f.label}
              placeholder={f.ph}
              value={form[f.key] ?? ""}
              onChange={update(f.key)}
            />
          ))}
        </div>

        {/* Vehicle type */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, color: "var(--clr-txt-2)", marginBottom: 10, display: "block" }}>Vehicle Type</label>
          <div style={{ display: "flex", gap: 10 }}>
            {VEHICLE_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setVType(t.id)}
                style={{
                  flex:           1,
                  padding:        "16px 10px",
                  borderRadius:   12,
                  border:         `1px solid ${vType === t.id ? "var(--clr-violet-2)" : "var(--clr-bor)"}`,
                  background:     vType === t.id ? "rgba(124,58,237,0.12)" : "var(--clr-sur)",
                  color:          "var(--clr-txt)",
                  cursor:         "pointer",
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  gap:            8,
                  transition:     "all 0.15s",
                }}
              >
                <t.icon size={20} color={vType === t.id ? "var(--clr-violet-3)" : "var(--clr-txt-2)"} />
                <span style={{ fontSize: 12, fontWeight: vType === t.id ? 600 : 400, color: vType === t.id ? "var(--clr-violet-3)" : "var(--clr-txt-2)" }}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button fullWidth onClick={submitVehicle}>
          {saved ? <><Check size={16} /> Submitted for Review!</> : <><Plus size={16} /> Register Vehicle</>}
        </Button>
      </div>
    </div>
  );
}
