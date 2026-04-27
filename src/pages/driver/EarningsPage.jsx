// src/pages/driver/EarningsPage.jsx
import { DollarSign, TrendingUp, Car, Award, Wallet } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { Button }   from "../../components/ui/Button";
import { useAuth }  from "../../hooks/useAuth";
import { MOCK_EARNINGS_CHART } from "../../data/mockData";

export function EarningsPage() {
  const { user } = useAuth();
  const max = Math.max(...MOCK_EARNINGS_CHART.map((e) => e.amount));

  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh", display: "flex", flexDirection: "column", gap: 24 }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Earnings</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
        <StatCard icon={DollarSign} label="This Week"   value={`Rs. ${user?.weeklyEarnings?.toLocaleString()}`} color="green"  />
        <StatCard icon={TrendingUp} label="All Time"    value={`Rs. ${user?.earnings?.toLocaleString()}`}       color="violet" />
        <StatCard icon={Car}        label="Trips"       value={String(user?.totalTrips)}                        color="cyan"   />
        <StatCard icon={Award}      label="Commission"  value="15%"                                             sub="Platform fee" color="amber" />
      </div>

      {/* Chart */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, marginBottom: 20 }}>This Week</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
          {MOCK_EARNINGS_CHART.map((e, i) => (
            <div key={e.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ fontSize: 9, color: "var(--clr-txt-3)" }}>{e.amount}</div>
              <div style={{
                width: "100%", borderRadius: "6px 6px 0 0",
                height: `${(e.amount / max) * 108}px`,
                background: i === 4
                  ? "linear-gradient(180deg,var(--clr-violet-2),var(--clr-violet))"
                  : "linear-gradient(180deg,rgba(124,58,237,0.5),rgba(124,58,237,0.1))",
                boxShadow: i === 4 ? "var(--sh-v)" : "none",
              }} />
              <div style={{ fontSize: 10, color: "var(--clr-txt-3)" }}>{e.day}</div>
            </div>
          ))}
        </div>
      </div>

      <Button variant="cyan" fullWidth>
        <Wallet size={16} /> Request Payout
      </Button>
    </div>
  );
}
