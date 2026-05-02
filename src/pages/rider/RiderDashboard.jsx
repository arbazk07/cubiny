// src/pages/rider/RiderDashboard.jsx — Cubiny Desktop v4
// Adds native "Trip Completed" notification
import { useState, useEffect } from "react";
import { MapPin, Phone, MessageSquare, CheckCircle, Star, Car, Zap, Bike } from "lucide-react";
import { MockMap }    from "../../components/map/MockMap";
import { Button }     from "../../components/ui/Button";
import { Input }      from "../../components/ui/Input";
import { Modal }      from "../../components/ui/Modal";
import { Avatar }     from "../../components/ui/Avatar";
import { StatusPill } from "../../components/ui/StatusPill";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { getAllFares } from "../../services/fareService";
import { requestRide } from "../../services/mockService";
import { electronNotify } from "../../hooks/useElectron";

const TYPES = [
  { id:"Economy", icon:Car,  desc:"Affordable, everyday"   },
  { id:"Premium", icon:Zap,  desc:"Comfort & luxury sedan" },
  { id:"Bike",    icon:Bike, desc:"Fast, beat the traffic" },
];

const STATES = {
  searching:   { label:"Finding your driver…", color:"var(--amb)"  },
  found:       { label:"Driver confirmed!",     color:"var(--grn)"  },
  en_route:    { label:"Driver on the way",     color:"var(--c3)"   },
  in_progress: { label:"Enjoy your ride",       color:"var(--v3)"   },
  completed:   { label:"You've arrived!",       color:"var(--grn)"  },
};

function RatingModal({ open, onClose }) {
  const [score,   setScore]   = useState(0);
  const [hover,   setHover]   = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const submit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false); setDone(true);
    setTimeout(onClose, 1400);
  };

  return (
    <Modal open={open} onClose={onClose} title="Rate your driver" subtitle="How was your experience with Hassan?">
      {done ? (
        <div style={{ textAlign:"center",padding:"20px 0" }}>
          <CheckCircle size={52} color="var(--grn)" style={{ margin:"0 auto 14px" }}/>
          <p style={{ fontFamily:"var(--font-d)",fontSize:18,marginBottom:4 }}>Thanks for rating!</p>
          <p style={{ fontSize:13,color:"var(--t3)" }}>Your feedback helps keep Cubiny great.</p>
        </div>
      ):(
        <>
          <div style={{ display:"flex",alignItems:"center",gap:14,padding:"16px 0 20px",borderBottom:"1px solid var(--b1)",marginBottom:20 }}>
            <Avatar initials="HR" size={50}/>
            <div>
              <div style={{ fontWeight:600,fontSize:15 }}>Hassan Raza</div>
              <div style={{ fontSize:12,color:"var(--t3)" }}>Toyota Corolla · LEJ-3421</div>
            </div>
          </div>
          <div style={{ display:"flex",justifyContent:"center",gap:10,marginBottom:20 }}>
            {[1,2,3,4,5].map(s=>(
              <button key={s} onClick={()=>setScore(s)}
                onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
                style={{ background:"none",border:"none",cursor:"pointer",transition:"transform 0.15s",transform:(hover||score)>=s?"scale(1.25)":"scale(1)" }}>
                <Star size={34} color="var(--amb)" fill={(hover||score)>=s?"var(--amb)":"transparent"}/>
              </button>
            ))}
          </div>
          {score > 0 && <div style={{ textAlign:"center",marginBottom:16,fontSize:14,color:"var(--t2)" }}>
            {["","Poor","Below average","Good","Very good","Excellent!"][score]}
          </div>}
          <textarea value={comment} onChange={e=>setComment(e.target.value)}
            placeholder="Add a comment (optional)…"
            style={{ width:"100%",height:80,resize:"none",background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:"var(--r2)",padding:"12px 16px",fontSize:14,color:"var(--t1)",marginBottom:16 }}/>
          <div style={{ display:"flex",gap:10 }}>
            <Button variant="secondary" fullWidth onClick={onClose}>Skip</Button>
            <Button variant="primary"   fullWidth onClick={submit} loading={loading} disabled={!score}>Submit Rating</Button>
          </div>
        </>
      )}
    </Modal>
  );
}

export function RiderDashboard() {
  const [state,      setState]      = useState("idle");
  const [pickup,     setPickup]     = useState("");
  const [dropoff,    setDropoff]    = useState("");
  const [selType,    setSelType]    = useState("Economy");
  const [fares,      setFares]      = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showRate,   setShowRate]   = useState(false);

  useEffect(() => { setFares(getAllFares(7.2, 18)); }, []);

  const activeFare = fares.find(f => f.id === selType);

  const handleRequest = async () => {
    if (!pickup || !dropoff) return;
    setSubmitting(true);
    await requestRide({ pickup_location: pickup, dropoff_location: dropoff, vehicle_type: selType });
    setSubmitting(false);
    setState("searching");
    setTimeout(() => setState("found"),       2200);
    setTimeout(() => setState("en_route"),    3800);
    setTimeout(() => setState("in_progress"), 6500);
    setTimeout(() => {
      setState("completed");
      setShowRate(true);
      // 🔔 Native notification
      electronNotify.rideCompleted({ fare: activeFare?.finalFare ?? 0 });
    }, 11000);
  };

  const isIdle = state === "idle", isCompleted = state === "completed";
  const showRoute  = ["en_route","in_progress","completed"].includes(state);
  const showDriver = ["found","en_route","in_progress","completed"].includes(state);

  return (
    <div style={{ display:"flex", height:"100vh" }}>
      <div style={{ flex:1, position:"relative" }}>
        <MockMap showRoute={showRoute} showRider showDriver={showDriver}/>
        {!isIdle && (
          <div style={{
            position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",
            backdropFilter:"blur(20px)",background:"rgba(10,10,30,0.75)",
            border:"1px solid var(--b2)",borderRadius:100,padding:"10px 22px",
            display:"flex",alignItems:"center",gap:10,boxShadow:"var(--sh-card)",
          }} className="animate-fade-up">
            <div style={{ width:8,height:8,borderRadius:"50%",background:STATES[state]?.color,boxShadow:`0 0 10px ${STATES[state]?.color}` }}/>
            <span style={{ fontSize:13,fontWeight:500 }}>{STATES[state]?.label}</span>
          </div>
        )}
      </div>

      <div style={{ width:348,background:"rgba(5,5,16,0.97)",borderLeft:"1px solid var(--b1)",display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <div style={{ padding:"22px 24px 16px",borderBottom:"1px solid var(--b1)",background:"linear-gradient(180deg,rgba(109,40,217,0.06),transparent)" }}>
          <h2 style={{ fontFamily:"var(--font-d)",fontSize:20,letterSpacing:"-0.02em",marginBottom:3 }}>Book a Ride</h2>
          <p style={{ fontSize:12,color:"var(--t3)" }}>Rawalpindi / Islamabad Metro</p>
        </div>

        <div style={{ flex:1,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:18 }}>
          {isIdle && fares.length > 0 && (
            <>
              <div style={{ display:"flex",flexDirection:"column",gap:3 }}>
                {[{ph:"Pickup location",dot:"var(--c2)",val:pickup,set:setPickup},{ph:"Drop-off destination",dot:"var(--v2)",val:dropoff,set:setDropoff}].map((f,i)=>(
                  <div key={i} style={{ position:"relative" }}>
                    <div style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",width:8,height:i===0?8:6,borderRadius:i===0?"50%":2,background:f.dot,zIndex:1 }}/>
                    <input placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)}
                      style={{ width:"100%",background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:i===0?"var(--r2) var(--r2) 0 0":"0 0 var(--r2) var(--r2)",padding:"13px 16px 13px 32px",fontSize:14,color:"var(--t1)",fontFamily:"var(--font-b)" }}
                      onFocus={e=>{e.target.style.background="var(--s3)";e.target.style.borderColor="rgba(109,40,217,0.4)"}}
                      onBlur={e=>{e.target.style.background="var(--s2)";e.target.style.borderColor="var(--b2)"}}
                    />
                  </div>
                ))}
              </div>

              <div>
                <p style={{ fontSize:11,color:"var(--t4)",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600,marginBottom:10 }}>Select type</p>
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  {TYPES.map(t => {
                    const f = fares.find(x => x.id === t.id);
                    const sel = selType === t.id;
                    return (
                      <button key={t.id} onClick={() => setSelType(t.id)} style={{
                        display:"flex",alignItems:"center",justifyContent:"space-between",
                        padding:"14px 16px",borderRadius:"var(--r2)",cursor:"pointer",
                        border:`1px solid ${sel?"rgba(109,40,217,0.45)":"var(--b1)"}`,
                        background:sel?"rgba(109,40,217,0.1)":"var(--s1)",transition:"all 0.15s",
                        boxShadow:sel?"0 0 0 1px rgba(109,40,217,0.15)":"none",
                      }}>
                        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                          <div style={{ background:sel?"rgba(109,40,217,0.15)":"var(--s2)",borderRadius:8,padding:8,border:`1px solid ${sel?"rgba(109,40,217,0.3)":"var(--b1)"}` }}>
                            <t.icon size={15} color={sel?"var(--v3)":"var(--t3)"}/>
                          </div>
                          <div style={{ textAlign:"left" }}>
                            <div style={{ fontSize:14,fontWeight:600,color:sel?"var(--t1)":"var(--t2)" }}>{t.id}</div>
                            <div style={{ fontSize:11,color:"var(--t4)" }}>{t.desc} · {f?.eta}</div>
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:15,fontWeight:700,color:sel?"var(--v3)":"var(--t2)",fontFamily:"var(--font-d)" }}>Rs. {f?.finalFare}</div>
                          {f?.surgeApplied && <div style={{ fontSize:10,color:"var(--amb)",marginTop:2 }}>⚡ ×{f.multiplier}</div>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeFare && (
                <div style={{ background:"linear-gradient(135deg,rgba(109,40,217,0.08),rgba(8,145,178,0.05))",border:"1px solid rgba(109,40,217,0.2)",borderRadius:"var(--r2)",padding:"16px 18px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:11,color:"var(--t3)",marginBottom:3 }}>Estimated fare</div>
                      <div style={{ fontSize:28,fontWeight:800,fontFamily:"var(--font-d)",background:"linear-gradient(135deg,var(--v3),var(--c3))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:"-0.02em" }}>
                        Rs. {activeFare.finalFare}
                      </div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:11,color:"var(--t3)",marginBottom:4 }}>7.2 km · ~18 min</div>
                      {activeFare.surgeApplied && (
                        <div style={{ background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:100,padding:"3px 8px",fontSize:10,color:"#fcd34d" }}>
                          ⚡ {activeFare.surgeLabel} ×{activeFare.multiplier}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Button fullWidth size="lg" onClick={handleRequest} loading={submitting} disabled={!pickup||!dropoff}>
                <MapPin size={16}/> Request Cubiny
              </Button>
            </>
          )}

          {state==="searching" && <LoadingSpinner label="Connecting you with a nearby driver…"/>}

          {!isIdle && state!=="searching" && !isCompleted && (
            <div className="animate-fade-up" style={{ display:"flex",flexDirection:"column",gap:14 }}>
              <div style={{ background:"rgba(109,40,217,0.08)",border:"1px solid rgba(109,40,217,0.2)",borderRadius:"var(--r3)",padding:20 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14,alignItems:"center" }}>
                  <StatusPill status={state==="in_progress"?"In Progress":state==="en_route"?"Driver En Route":"Accepted"}/>
                  <span style={{ fontSize:11,color:"var(--t4)",fontFamily:"var(--font-m)" }}>RD-8823</span>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                  <Avatar initials="HR" size={48} glow={state==="en_route"} status="online"/>
                  <div>
                    <div style={{ fontWeight:700,fontSize:15 }}>Hassan Raza</div>
                    <div style={{ fontSize:12,color:"var(--t3)",display:"flex",alignItems:"center",gap:4,marginTop:2 }}>
                      <Star size={11} color="var(--amb)" fill="var(--amb)"/> 4.9 · Toyota Corolla
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex",gap:8 }}>
                  <Button variant="secondary" size="sm" style={{ flex:1 }}><Phone size={12}/> Call</Button>
                  <Button variant="secondary" size="sm" style={{ flex:1 }}><MessageSquare size={12}/> Chat</Button>
                </div>
              </div>

              <div style={{ display:"flex",justifyContent:"space-between",padding:"14px 16px",background:"var(--s1)",borderRadius:"var(--r2)",border:"1px solid var(--b1)" }}>
                <div><div style={{ fontSize:10,color:"var(--t4)" }}>Fare</div><div style={{ fontWeight:700,fontSize:18,fontFamily:"var(--font-d)" }}>Rs. {activeFare?.finalFare}</div></div>
                <div><div style={{ fontSize:10,color:"var(--t4)" }}>Distance</div><div style={{ fontSize:13,fontWeight:600 }}>7.2 km</div></div>
                <div><div style={{ fontSize:10,color:"var(--t4)" }}>Payment</div><div style={{ fontSize:13,fontWeight:600 }}>Wallet</div></div>
              </div>
            </div>
          )}

          {isCompleted && (
            <div style={{ textAlign:"center",padding:"24px 0" }} className="animate-bounce-in">
              <div style={{ width:72,height:72,borderRadius:"50%",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",animation:"glowG 2s ease infinite" }}>
                <CheckCircle size={36} color="var(--grn)"/>
              </div>
              <h3 style={{ fontFamily:"var(--font-d)",fontSize:20,marginBottom:6 }}>You've arrived!</h3>
              <p style={{ fontSize:13,color:"var(--t3)",marginBottom:24 }}>Rs. {activeFare?.finalFare} charged to wallet</p>
              <Button fullWidth onClick={() => { setState("idle"); setPickup(""); setDropoff(""); }}>Book Another Ride</Button>
            </div>
          )}
        </div>
      </div>
      <RatingModal open={showRate} onClose={() => setShowRate(false)}/>
    </div>
  );
}
