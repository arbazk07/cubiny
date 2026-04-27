// src/pages/rider/PromoPage.jsx
import { useState } from "react";
import { Tag, Gift, Check, X } from "lucide-react";
import { Button }      from "../../components/ui/Button";
import { Input }       from "../../components/ui/Input";
import { StatusPill }  from "../../components/ui/StatusPill";
import { MOCK_PROMO_CODES } from "../../data/mockData";

export function PromoPage() {
  const [code,    setCode]    = useState("");
  const [applied, setApplied] = useState(null); // null | "success" | "error"

  const applyCode = () => {
    const found = MOCK_PROMO_CODES.find(
      (p) => p.code === code.toUpperCase().trim() && !p.isUsed,
    );
    setApplied(found ? "success" : "error");
  };

  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 24 }}>Promo Codes</h2>

      {/* Apply code */}
      <div className="glass" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 16 }}>Apply a Code</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Enter promo code…"
              value={code}
              onChange={(e) => { setCode(e.target.value); setApplied(null); }}
            />
          </div>
          <Button onClick={applyCode} style={{ padding: "0 20px" }}>
            <Tag size={14} />
          </Button>
        </div>

        {applied === "success" && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: "#4ade80", fontSize: 13 }}>
            <Check size={14} /> Code applied successfully!
          </div>
        )}
        {applied === "error" && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, color: "#f87171", fontSize: 13 }}>
            <X size={14} /> Invalid or expired code.
          </div>
        )}
      </div>

      {/* Available offers */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 16 }}>Your Offers</h3>
        {MOCK_PROMO_CODES.map((p) => (
          <div
            key={p.code}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "16px 0",
              borderBottom:   "1px solid var(--clr-bor)",
              opacity:        p.isUsed ? 0.5 : 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ background: p.isUsed ? "var(--clr-sur)" : "rgba(124,58,237,0.15)", borderRadius: 8, padding: 8 }}>
                <Gift size={14} color={p.isUsed ? "var(--clr-txt-3)" : "var(--clr-violet-3)"} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>{p.code}</div>
                <div style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>{p.discount} · Expires {p.expiry}</div>
              </div>
            </div>
            <StatusPill status={p.isUsed ? "Cancelled" : "Active"} />
          </div>
        ))}
      </div>
    </div>
  );
}
