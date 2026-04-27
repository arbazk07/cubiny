// src/pages/rider/WalletPage.jsx
import { useState } from "react";
import { Wallet, DollarSign, Plus, ArrowRight, CreditCard } from "lucide-react";
import { Button }    from "../../components/ui/Button";
import { Modal }     from "../../components/ui/Modal";
import { Input }     from "../../components/ui/Input";
import { MOCK_RIDE_HISTORY } from "../../data/mockData";

export function WalletPage() {
  const [showCard,  setShowCard]  = useState(false);
  const [showFunds, setShowFunds] = useState(false);
  const [amount,    setAmount]    = useState("");

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 24 }}>Wallet</h2>

      {/* Balance card */}
      <div className="glass-violet" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--clr-txt-2)", marginBottom: 8 }}>Available Balance</div>
        <div style={{ fontSize: 38, fontWeight: 800, fontFamily: "var(--font-display)", background: "linear-gradient(135deg,var(--clr-violet-2),var(--clr-cyan-2))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 20 }}>
          Rs. 2,340
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button style={{ flex: 1, padding: "10px 0" }} onClick={() => setShowFunds(true)}>
            <Plus size={14} /> Add Funds
          </Button>
          <Button variant="secondary" style={{ flex: 1, padding: "10px 0" }}>
            <ArrowRight size={14} /> Transfer
          </Button>
        </div>
      </div>

      {/* Payment methods */}
      <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, alignItems: "center" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>Payment Methods</h3>
          <button
            onClick={() => setShowCard(true)}
            style={{ background: "none", border: "1px solid var(--clr-bor-2)", borderRadius: 8, padding: "5px 10px", color: "var(--clr-txt-2)", fontSize: 12, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}
          >
            <Plus size={12} /> Add Card
          </button>
        </div>

        {[
          { label: "Wallet Balance", sub: "Rs. 2,340",          icon: Wallet,      active: true  },
          { label: "Cash Payment",   sub: "Pay driver directly", icon: DollarSign,  active: false },
        ].map((m) => (
          <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--clr-bor)" }}>
            <div style={{ background: "var(--clr-sur-2)", borderRadius: 10, padding: 10 }}>
              <m.icon size={16} color="var(--clr-violet-3)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "var(--clr-txt-2)" }}>{m.sub}</div>
            </div>
            {m.active && (
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--clr-green)", boxShadow: "0 0 8px var(--clr-green)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 18 }}>Recent Transactions</h3>
        {MOCK_RIDE_HISTORY.filter((r) => r.status === "Completed").map((r) => (
          <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--clr-bor)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{r.from} → {r.to}</div>
              <div style={{ fontSize: 11, color: "var(--clr-txt-3)" }}>{r.date}</div>
            </div>
            <span style={{ fontWeight: 600, color: "#f87171" }}>− Rs. {r.fare}</span>
          </div>
        ))}
      </div>

      {/* Add Card modal */}
      <Modal open={showCard} onClose={() => setShowCard(false)} title="Add Card">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Card Number"     placeholder="1234 5678 9012 3456" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Expiry" placeholder="MM/YY" />
            <Input label="CVV"    placeholder="•••"   />
          </div>
          <Input label="Cardholder Name" placeholder="As on card" />
          <Button fullWidth onClick={() => setShowCard(false)} style={{ marginTop: 8 }}>
            <CreditCard size={16} /> Save Card
          </Button>
        </div>
      </Modal>

      {/* Add Funds modal */}
      <Modal open={showFunds} onClose={() => setShowFunds(false)} title="Add Funds" maxWidth={360}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {quickAmounts.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(String(a))}
              style={{
                padding:    "8px 16px",
                borderRadius: 10,
                border:     `1px solid ${amount === String(a) ? "var(--clr-violet-2)" : "var(--clr-bor)"}`,
                background: amount === String(a) ? "rgba(124,58,237,0.15)" : "var(--clr-sur)",
                color:      amount === String(a) ? "var(--clr-violet-3)" : "var(--clr-txt-2)",
                fontSize:   13,
                cursor:     "pointer",
              }}
            >
              Rs. {a}
            </button>
          ))}
        </div>
        <Input
          type="number"
          placeholder="Or enter custom amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button fullWidth onClick={() => setShowFunds(false)}>
          Add Rs. {amount || "0"}
        </Button>
      </Modal>
    </div>
  );
}
