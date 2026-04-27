// src/pages/rider/ComplaintsPage.jsx
import { useState } from "react";
import { FileText, CheckCircle } from "lucide-react";
import { Button }    from "../../components/ui/Button";
import { Input }     from "../../components/ui/Input";
import { StatusPill }from "../../components/ui/StatusPill";
import { MOCK_COMPLAINTS } from "../../data/mockData";

export function ComplaintsPage() {
  const [subject,   setSubject]   = useState("");
  const [message,   setMessage]   = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (subject.trim() && message.trim()) setSubmitted(true);
  };

  return (
    <div className="mesh-bg" style={{ padding: 28, overflowY: "auto", height: "100vh" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 24 }}>Support & Complaints</h2>

      {/* Lodge complaint */}
      <div className="glass" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 18 }}>Lodge a Complaint</h3>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <CheckCircle size={44} color="var(--clr-green)" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontWeight: 600, fontFamily: "var(--font-display)" }}>Ticket submitted!</p>
            <p style={{ fontSize: 13, color: "var(--clr-txt-2)", marginTop: 6 }}>We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <Input
                label="Subject"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "var(--clr-txt-2)", marginBottom: 6, display: "block" }}>Details</label>
              <textarea
                placeholder="Describe what happened…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: "100%", height: 100, resize: "none",
                  background: "var(--clr-sur)", border: "1px solid var(--clr-bor-2)",
                  borderRadius: "var(--r)", padding: "12px 16px",
                  fontSize: 14, color: "var(--clr-txt)",
                }}
              />
            </div>
            <Button fullWidth onClick={submit}>
              <FileText size={14} /> Submit Ticket
            </Button>
          </>
        )}
      </div>

      {/* Ticket history */}
      <div className="glass" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, marginBottom: 16 }}>My Tickets</h3>
        {MOCK_COMPLAINTS.map((c) => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--clr-bor)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.subject}</div>
              <div style={{ fontSize: 11, color: "var(--clr-txt-3)" }}>{c.id} · {c.date}</div>
            </div>
            <StatusPill status={c.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
