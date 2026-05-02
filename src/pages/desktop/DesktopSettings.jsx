// src/pages/desktop/DesktopSettings.jsx — Cubiny Desktop v4
// Desktop-specific settings — only meaningful in Electron.
import { useState, useEffect } from "react";
import { Monitor, Bell, Moon, Zap, Shield, Info, ExternalLink, Check } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useElectron, electronWindow, electronNotify, electronApp } from "../../hooks/useElectron";

export function DesktopSettings() {
  const { IS_ELECTRON, version, platform } = useElectron();
  const [alwaysTop,    setAlwaysTop]    = useState(false);
  const [notifTest,    setNotifTest]    = useState(false);
  const [saved,        setSaved]        = useState(false);

  const handleAlwaysTop = (val) => {
    setAlwaysTop(val);
    electronWindow.alwaysOnTop(val);
  };

  const testNotification = () => {
    electronNotify.send({
      title: "🚗 Test Notification",
      body:  "Native desktop notifications are working correctly!",
      urgency: "normal",
    });
    setNotifTest(true);
    setTimeout(() => setNotifTest(false), 2000);
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="glass-sm" style={{ padding:24, marginBottom:16 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:14,borderBottom:"1px solid var(--b1)" }}>
        <div style={{ background:"rgba(109,40,217,0.12)",borderRadius:8,padding:7,border:"1px solid rgba(109,40,217,0.2)" }}>
          <Icon size={15} color="var(--v3)"/>
        </div>
        <h3 style={{ fontFamily:"var(--font-d)",fontSize:15 }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ label, sub, value, onChange }) => (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--b1)" }}>
      <div>
        <div style={{ fontSize:14,fontWeight:500 }}>{label}</div>
        {sub && <div style={{ fontSize:12,color:"var(--t3)",marginTop:2 }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{
        position:"relative",width:44,height:24,borderRadius:100,border:"none",cursor:"pointer",
        background: value ? "linear-gradient(135deg,#15803d,#22c55e)" : "var(--s3)",
        transition:"all 0.25s",
      }}>
        <div style={{
          position:"absolute",top:3,left:value?22:3,width:18,height:18,borderRadius:"50%",
          background:"#fff",transition:"left 0.25s cubic-bezier(0.4,0,0.2,1)",
          boxShadow:"0 1px 4px rgba(0,0,0,0.3)",
        }}/>
      </button>
    </div>
  );

  return (
    <div className="mesh-subtle" style={{ padding:28,overflowY:"auto",height:"100vh" }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:"var(--font-d)",fontSize:22,letterSpacing:"-0.02em" }}>Settings</h2>
        <p style={{ fontSize:12,color:"var(--t3)",marginTop:3 }}>
          {IS_ELECTRON ? `Desktop App · v${version} · ${platform}` : "Web Mode — Desktop features unavailable"}
        </p>
      </div>

      {!IS_ELECTRON && (
        <div style={{ background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:"var(--r2)",padding:"14px 18px",marginBottom:20,display:"flex",gap:10,alignItems:"center" }}>
          <span>⚠️</span>
          <div>
            <div style={{ fontWeight:600,color:"#fcd34d",fontSize:13,marginBottom:2 }}>Running in Browser Mode</div>
            <div style={{ fontSize:12,color:"var(--t3)" }}>Desktop features like system tray, native notifications and window controls require the Electron app.</div>
          </div>
        </div>
      )}

      {/* Window */}
      <Section icon={Monitor} title="Window">
        <Toggle
          label="Always on Top"
          sub="Keep Cubiny above all other windows"
          value={alwaysTop}
          onChange={handleAlwaysTop}
        />
        <div style={{ display:"flex",gap:10,paddingTop:14 }}>
          <Button variant="secondary" size="sm" onClick={electronWindow.minimize} disabled={!IS_ELECTRON}>
            Minimize
          </Button>
          <Button variant="secondary" size="sm" onClick={electronWindow.maximize} disabled={!IS_ELECTRON}>
            Maximize
          </Button>
          <Button variant="secondary" size="sm" onClick={electronWindow.fullscreen} disabled={!IS_ELECTRON}>
            Fullscreen
          </Button>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications">
        <Toggle label="Ride Requests"           sub="Native alert when an incoming ride arrives"     value={true}  onChange={()=>{}}/>
        <Toggle label="Trip Completed"          sub="Notify when your ride finishes"                 value={true}  onChange={()=>{}}/>
        <Toggle label="System Tray Alerts"      sub="Show alerts when app is minimised to tray"      value={true}  onChange={()=>{}}/>
        <div style={{ paddingTop:14 }}>
          <Button variant="secondary" size="sm" onClick={testNotification} disabled={!IS_ELECTRON} loading={notifTest}>
            {notifTest ? <><Check size={13}/> Sent!</> : <><Bell size={13}/> Test Notification</>}
          </Button>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Moon} title="Appearance">
        <div style={{ display:"flex",gap:10 }}>
          {[{id:"dark",label:"Dark",active:true},{id:"system",label:"System"},{id:"light",label:"Light (beta)"}].map(t=>(
            <button key={t.id} style={{
              flex:1,padding:"12px 8px",borderRadius:"var(--r2)",
              border:`1px solid ${t.active?"rgba(109,40,217,0.45)":"var(--b1)"}`,
              background: t.active?"rgba(109,40,217,0.1)":"var(--s1)",
              color: t.active?"var(--v3)":"var(--t3)",fontSize:12,cursor:"pointer",fontFamily:"var(--font-b)",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Performance */}
      <Section icon={Zap} title="Performance">
        <Toggle label="Hardware Acceleration" sub="Use GPU for smoother rendering (restart required)" value={true}  onChange={()=>{}}/>
        <Toggle label="Background Updates"    sub="Fetch ride data in background while app is hidden" value={true}  onChange={()=>{}}/>
      </Section>

      {/* Privacy */}
      <Section icon={Shield} title="Privacy & Data">
        <Toggle label="Analytics"        sub="Help improve Cubiny with anonymous usage stats"  value={false} onChange={()=>{}}/>
        <Toggle label="Crash Reports"    sub="Automatically send crash reports to our team"    value={true}  onChange={()=>{}}/>
        <div style={{ paddingTop:14 }}>
          <Button variant="danger" size="sm">Clear Local Cache</Button>
        </div>
      </Section>

      {/* About */}
      <Section icon={Info} title="About Cubiny">
        {[
          ["Version",  `v${version}`],
          ["Platform", platform],
          ["Mode",     IS_ELECTRON ? "Electron Desktop" : "Web Browser"],
          ["Backend",  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"],
        ].map(([k,v])=>(
          <div key={k} style={{ display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--b1)",fontSize:13 }}>
            <span style={{ color:"var(--t3)" }}>{k}</span>
            <span style={{ fontFamily:"var(--font-m)",color:"var(--t1)" }}>{v}</span>
          </div>
        ))}
        <div style={{ display:"flex",gap:10,paddingTop:14 }}>
          <Button variant="secondary" size="sm"
            onClick={()=>window.cubinyShell?.openURL("https://cubiny.pk")}>
            <ExternalLink size={12}/> Website
          </Button>
          <Button variant="secondary" size="sm"
            onClick={()=>window.cubinyShell?.openURL("mailto:support@cubiny.pk")}>
            Support
          </Button>
        </div>
      </Section>

      <Button fullWidth onClick={save} style={{ marginBottom:20 }}>
        {saved ? <><Check size={15}/> Settings Saved!</> : "Save Settings"}
      </Button>
    </div>
  );
}
