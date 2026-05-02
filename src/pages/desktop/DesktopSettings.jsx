// src/pages/desktop/DesktopSettings.jsx — Cubiny v6
import { useState } from 'react';
import { User, Bell, Shield, Globe, Smartphone, ChevronRight } from 'lucide-react';
import { Input }    from '../../components/ui/Input';
import { Button }   from '../../components/ui/Button';
import { useAuth }  from '../../hooks/useAuth';

const SECTIONS = [
  { id:'profile',       icon:User,       label:'Profile & Account'  },
  { id:'notifications', icon:Bell,       label:'Notifications'      },
  { id:'privacy',       icon:Shield,     label:'Privacy & Security' },
  { id:'language',      icon:Globe,      label:'Language & Region'  },
  { id:'app',           icon:Smartphone, label:'App Preferences'    },
];

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width:44, height:24, borderRadius:99,
      background: on ? '#22C55E' : 'var(--border)',
      border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0,
    }}>
      <div style={{
        width:18, height:18, borderRadius:'50%', background:'white',
        position:'absolute', top:3, left: on ? 23 : 3,
        transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
      }}/>
    </button>
  );
}

export function DesktopSettings() {
  const { user }                   = useAuth();
  const [section,  setSection]     = useState('profile');
  const [name,     setName]        = useState(user?.name ?? '');
  const [email,    setEmail]       = useState(user?.email ?? '');
  const [saved,    setSaved]       = useState(false);
  const [notifs,   setNotifs]      = useState({ rides:true, promos:false, updates:true });

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display:'flex', height:'100%', overflow:'hidden' }}>
      {/* Settings nav */}
      <div style={{ width:220, borderRight:'1px solid var(--border)', background:'white', padding:'20px 0', flexShrink:0 }}>
        <p style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', padding:'0 16px 10px' }}>Settings</p>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            width:'100%', display:'flex', alignItems:'center', gap:10,
            padding:'10px 16px', border:'none', borderRight:`2px solid ${section===s.id?'#22C55E':'transparent'}`,
            background: section===s.id ? '#F0FDF4' : 'transparent',
            color: section===s.id ? '#16A34A' : 'var(--text-secondary)',
            fontSize:13, fontWeight: section===s.id ? 600 : 400,
            cursor:'pointer', fontFamily:'var(--font)', textAlign:'left', transition:'all 0.15s',
          }}
            onMouseEnter={e=>{ if(section!==s.id){ e.currentTarget.style.background='var(--bg-subtle)'; }}}
            onMouseLeave={e=>{ if(section!==s.id){ e.currentTarget.style.background='transparent'; }}}
          >
            <s.icon size={15} strokeWidth={section===s.id?2.2:1.8}/>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'28px 32px', background:'var(--bg)' }}>
        {section === 'profile' && (
          <>
            <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.025em', marginBottom:4 }}>Profile & Account</h2>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:24 }}>Manage your personal information</p>
            <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'24px', boxShadow:'var(--shadow-sm)', display:'flex', flexDirection:'column', gap:16, maxWidth:460 }}>
              <Input label="Full Name" value={name} onChange={e=>setName(e.target.value)}/>
              <Input label="Email Address" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
              <Input label="Role" value={user?.role ?? ''} disabled style={{ textTransform:'capitalize', opacity:0.6 }}/>
              <div style={{ display:'flex', gap:10 }}>
                <Button variant={saved?'success':'primary'} onClick={handleSave}>
                  {saved ? '✓ Saved!' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={() => { setName(user?.name??''); setEmail(user?.email??''); }}>
                  Reset
                </Button>
              </div>
            </div>
          </>
        )}

        {section === 'notifications' && (
          <>
            <h2 style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)', letterSpacing:'-0.025em', marginBottom:4 }}>Notifications</h2>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:24 }}>Control what alerts you receive</p>
            <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)', maxWidth:460 }}>
              {[
                { key:'rides',   label:'Ride Updates',      desc:'Driver location, arrival, and completion' },
                { key:'promos',  label:'Promotions',        desc:'Discount codes and special offers'        },
                { key:'updates', label:'App Updates',       desc:'New features and important changes'       },
              ].map(({ key, label, desc }, i, arr) => (
                <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:i<arr.length-1?'1px solid var(--border)':'none' }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)' }}>{label}</p>
                    <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{desc}</p>
                  </div>
                  <Toggle on={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]:v }))}/>
                </div>
              ))}
            </div>
          </>
        )}

        {(section === 'privacy' || section === 'language' || section === 'app') && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'60%', color:'var(--text-muted)', gap:12 }}>
            <div style={{ width:56, height:56, borderRadius:'var(--r-xl)', background:'var(--bg-subtle)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {section==='privacy'  && <Shield   size={24} strokeWidth={1.5}/>}
              {section==='language' && <Globe    size={24} strokeWidth={1.5}/>}
              {section==='app'      && <Smartphone size={24} strokeWidth={1.5}/>}
            </div>
            <p style={{ fontSize:15, fontWeight:600, color:'var(--text-secondary)' }}>{SECTIONS.find(s=>s.id===section)?.label}</p>
            <p style={{ fontSize:13 }}>Available in the next release</p>
          </div>
        )}
      </div>
    </div>
  );
}
