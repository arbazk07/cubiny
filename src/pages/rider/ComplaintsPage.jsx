// src/pages/rider/ComplaintsPage.jsx — Cubiny v6
import { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { Input }          from '../../components/ui/Input';
import { Button }         from '../../components/ui/Button';
import { Modal }          from '../../components/ui/Modal';
import { StatusPill }     from '../../components/ui/StatusPill';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth }        from '../../hooks/useAuth';
import { getUserComplaints, submitComplaint } from '../../services/mockService';

const CATEGORIES = ['Ride Issue','Driver Behaviour','Payment Problem','App Bug','Other'];

export function ComplaintsPage() {
  const { user }                    = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoad]          = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [subject,  setSubject]      = useState('');
  const [message,  setMessage]      = useState('');
  const [category, setCategory]     = useState('Ride Issue');
  const [submitting, setSub]        = useState(false);
  const [submitted, setSubmitted]   = useState(null);
  const [subjectErr, setSubErr]     = useState('');
  const [messageErr, setMsgErr]     = useState('');

  useEffect(() => { getUserComplaints().then(c => { setComplaints(c); setLoad(false); }); }, []);

  const handleSubmit = async () => {
    let hasErr = false;
    if (!subject.trim()) { setSubErr('Subject is required'); hasErr = true; }
    if (!message.trim()) { setMsgErr('Please describe your issue'); hasErr = true; }
    if (hasErr) return;
    setSub(true);
    const r = await submitComplaint(subject, message, category);
    setSubmitted(r.ticketId);
    setSub(false);
    setComplaints(p => [{ id:r.ticketId, subject, date:'Just now', status:'Open' }, ...p]);
  };

  if (loading) return <LoadingSpinner label="Loading support tickets…"/>;

  return (
    <div className="page-scroll">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.03em' }}>Support</h1>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:3 }}>We typically respond within 24 hours</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}><Plus size={14}/> New Ticket</Button>
      </div>

      {/* Complaints list */}
      {complaints.length > 0 ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {complaints.map(c => (
            <div key={c.id} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'16px 20px', boxShadow:'var(--shadow-sm)', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:c.status==='Open'?'#FEF3C7':'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <FileText size={16} color={c.status==='Open'?'#F59E0B':'#22C55E'} strokeWidth={2}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.subject}</p>
                <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{c.date} · {c.id}</p>
              </div>
              <StatusPill status={c.status}/>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--text-muted)' }}>
          <FileText size={32} style={{ margin:'0 auto 12px', opacity:0.4 }}/>
          <p style={{ fontSize:15, fontWeight:600 }}>No support tickets yet</p>
          <p style={{ fontSize:13, marginTop:4 }}>Submit a ticket if you need help</p>
        </div>
      )}

      {/* New ticket modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setSubmitted(null); setSubject(''); setMessage(''); setSubErr(''); setMsgErr(''); }}
        title="Submit Support Ticket" subtitle="Describe your issue and we'll get back to you">
        {submitted ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ width:60, height:60, borderRadius:'50%', background:'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <CheckCircle size={28} color="#22C55E" strokeWidth={2}/>
            </div>
            <p style={{ fontSize:17, fontWeight:700, color:'var(--text-primary)', marginBottom:6 }}>Ticket Submitted!</p>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:4 }}>Reference: <span style={{ fontFamily:'monospace', fontWeight:700, color:'var(--cobalt)' }}>{submitted}</span></p>
            <p style={{ fontSize:12, color:'var(--text-muted)' }}>We'll email you at {user?.email}</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <p style={{ fontSize:12, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>Category</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} style={{
                    padding:'6px 12px', borderRadius:99, fontSize:12, fontWeight:600,
                    background: category===cat ? '#EFF6FF' : 'var(--bg-subtle)',
                    border: `1.5px solid ${category===cat ? '#2563EB' : 'var(--border)'}`,
                    color: category===cat ? '#1D4ED8' : 'var(--text-secondary)',
                    cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.12s',
                  }}>{cat}</button>
                ))}
              </div>
            </div>
            <Input label="Subject" placeholder="Brief description of your issue" value={subject}
              onChange={e=>{ setSubject(e.target.value); setSubErr(''); }} error={subjectErr}/>
            <div>
              {messageErr && <p style={{ fontSize:12, color:'#DC2626', marginBottom:4 }}>{messageErr}</p>}
              <textarea value={message} onChange={e=>{setMessage(e.target.value);setMsgErr('');}}
                placeholder="Tell us what happened in detail…"
                style={{
                  width:'100%', height:100, resize:'none', padding:'10px 14px',
                  background:'var(--bg-subtle)', border:`1.5px solid ${messageErr?'#EF4444':'var(--border)'}`,
                  borderRadius:'var(--r-lg)', fontSize:13, color:'var(--text-primary)',
                  fontFamily:'var(--font)', outline:'none', transition:'border-color 0.15s',
                }}
                onFocus={e=>{ e.target.style.borderColor='#2563EB'; e.target.style.background='white'; }}
                onBlur={e=>{ e.target.style.borderColor=messageErr?'#EF4444':'var(--border)'; e.target.style.background='var(--bg-subtle)'; }}
              />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <Button variant="secondary" fullWidth onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="primary"   fullWidth onClick={handleSubmit} loading={submitting}>Submit Ticket</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
