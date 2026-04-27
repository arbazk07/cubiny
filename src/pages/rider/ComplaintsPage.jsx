// src/pages/rider/ComplaintsPage.jsx  —  Cubiny v2
import { useState, useEffect } from "react";
import { FileText, CheckCircle, Send } from "lucide-react";
import { Button }     from "../../components/ui/Button";
import { Input }      from "../../components/ui/Input";
import { StatusPill } from "../../components/ui/StatusPill";
import { useAuth }    from "../../hooks/useAuth";
import { getUserComplaints, submitComplaint } from "../../services/mockService";

const CATEGORIES = ["Driver Behaviour","Wrong Route","Overcharging","App Issue","Other"];

export function ComplaintsPage() {
  const { user }                  = useAuth();
  const [tickets,   setTickets]   = useState([]);
  const [subject,   setSubject]   = useState("");
  const [message,   setMessage]   = useState("");
  const [category,  setCategory]  = useState(CATEGORIES[0]);
  const [submitting,setSub]       = useState(false);
  const [submitted, setSubmitted] = useState(null);

  useEffect(()=>{ getUserComplaints(user?.id).then(setTickets); },[user]);

  const submit = async () => {
    if (!subject.trim()||!message.trim()) return;
    setSub(true);
    const res = await submitComplaint(subject, message, user?.id);
    setSub(false);
    setSubmitted(res.ticketId);
    setSubject(""); setMessage("");
  };

  return (
    <div className="mesh-subtle" style={{ padding:28, overflowY:"auto", height:"100vh" }}>
      <h2 style={{ fontFamily:"var(--font-d)", fontSize:22, letterSpacing:"-0.02em", marginBottom:24 }}>Support</h2>

      {/* Form */}
      <div className="glass-sm" style={{ padding:24, marginBottom:20 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:16, marginBottom:4 }}>Lodge a Complaint</h3>
        <p style={{ fontSize:13, color:"var(--t3)", marginBottom:20 }}>Our support team responds within 24 hours.</p>

        {submitted ? (
          <div style={{ textAlign:"center", padding:"24px 0" }}>
            <CheckCircle size={52} color="var(--grn)" style={{ margin:"0 auto 14px" }}/>
            <p style={{ fontFamily:"var(--font-d)", fontSize:17, marginBottom:4 }}>Ticket Submitted!</p>
            <p style={{ fontSize:13, color:"var(--t3)", marginBottom:4 }}>Reference: <span style={{ fontFamily:"var(--font-m)", color:"var(--v3)" }}>{submitted}</span></p>
            <p style={{ fontSize:12, color:"var(--t4)" }}>We'll email you at {user?.email}</p>
            <button onClick={()=>setSubmitted(null)} style={{ marginTop:16, background:"none", border:"none", color:"var(--v3)", fontSize:13, cursor:"pointer" }}>
              Submit another
            </button>
          </div>
        ):(
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <p style={{ fontSize:12, color:"var(--t3)", marginBottom:8 }}>Category</p>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {CATEGORIES.map(c=>(
                  <button key={c} onClick={()=>setCategory(c)} style={{
                    padding:"6px 12px", borderRadius:"var(--r1)", border:`1px solid ${category===c?"rgba(109,40,217,0.45)":"var(--b1)"}`,
                    background: category===c?"rgba(109,40,217,0.12)":"var(--s1)",
                    color: category===c?"var(--v3)":"var(--t3)", fontSize:12, cursor:"pointer", fontFamily:"var(--font-b)",
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <Input label="Subject" placeholder="Brief description of your issue" value={subject} onChange={e=>setSubject(e.target.value)}/>
            <div>
              <label style={{ fontSize:12, color:"var(--t3)", marginBottom:8, display:"block", fontWeight:500 }}>Details</label>
              <textarea value={message} onChange={e=>setMessage(e.target.value)}
                placeholder="Please describe what happened in detail…"
                style={{ width:"100%", height:110, resize:"none", background:"var(--s2)", border:"1px solid var(--b2)", borderRadius:"var(--r2)", padding:"12px 16px", fontSize:14, color:"var(--t1)", fontFamily:"var(--font-b)", lineHeight:1.6 }}/>
            </div>
            <Button fullWidth loading={submitting} onClick={submit} disabled={!subject.trim()||!message.trim()}>
              <Send size={14}/> Submit Ticket
            </Button>
          </div>
        )}
      </div>

      {/* Ticket list */}
      <div className="glass-sm" style={{ padding:24 }}>
        <h3 style={{ fontFamily:"var(--font-d)", fontSize:15, marginBottom:18 }}>My Tickets</h3>
        {tickets.map(c=>(
          <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid var(--b1)" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>{c.subject}</div>
              <div style={{ fontSize:11, color:"var(--t4)", marginTop:2, fontFamily:"var(--font-m)" }}>{c.id} · {c.date}</div>
            </div>
            <StatusPill status={c.status}/>
          </div>
        ))}
      </div>
    </div>
  );
}
