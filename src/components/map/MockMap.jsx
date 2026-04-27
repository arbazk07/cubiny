// src/components/map/MockMap.jsx  —  Cubiny v2
// Iteration 4: replace with Leaflet / MapLibre GL JS
import { Plus, Minus, Navigation2 } from "lucide-react";

export function MockMap({ showRoute = false, showRider = false, showDriver = false, compact = false }) {
  const h = compact ? 220 : 400;
  return (
    <div style={{ position:"relative", width:"100%", height:"100%", overflow:"hidden", borderRadius:"inherit" }}>
      <svg width="100%" height="100%" viewBox={`0 0 600 ${h}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="mg" cx="30%" cy="25%">
            <stop offset="0%"   stopColor="#111135"/>
            <stop offset="100%" stopColor="#050510"/>
          </radialGradient>
          <linearGradient id="rg" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#8b5cf6"/><stop offset="1" stopColor="#22d3ee"/>
          </linearGradient>
          <filter id="gf"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        <rect width="600" height={h} fill="url(#mg)"/>

        {/* Grid */}
        {Array.from({length:12}).map((_,i)=>(
          <line key={`h${i}`} x1="0" y1={i*(h/10)} x2="600" y2={i*(h/10)} stroke="rgba(109,40,217,0.06)" strokeWidth="1"/>
        ))}
        {Array.from({length:12}).map((_,i)=>(
          <line key={`v${i}`} x1={i*55} y1="0" x2={i*55} y2={h} stroke="rgba(8,145,178,0.05)" strokeWidth="1"/>
        ))}

        {/* City blocks */}
        {[[55,60,105,55],[175,45,145,75],[340,75,90,50],[450,55,80,65],
          [55,170,125,65],[210,160,95,85],[340,155,155,95],[510,170,65,75],
          [70,280,205,55],[310,275,195,55]].map(([x,y,w,bh],i)=>(
          <rect key={i} x={x} y={y} width={w} height={bh} rx="6"
            fill={`rgba(${i%2===0?"109,40,217":"8,145,178"},0.055)`}
            stroke={`rgba(${i%2===0?"109,40,217":"8,145,178"},0.11)`} strokeWidth="1"/>
        ))}

        {/* Roads */}
        <rect x="0" y="140" width="600" height="14" fill="rgba(255,255,255,0.035)" rx="2"/>
        <rect x="155" y="0" width="10" height={h} fill="rgba(255,255,255,0.03)" rx="2"/>
        <rect x="310" y="0" width="10" height={h} fill="rgba(255,255,255,0.03)" rx="2"/>
        <rect x="470" y="0" width="8" height={h} fill="rgba(255,255,255,0.025)" rx="2"/>

        {/* Road dashes */}
        {Array.from({length:10}).map((_,i)=>(
          <rect key={i} x={i*62+10} y="146" width="30" height="2" fill="rgba(255,255,255,0.08)" rx="1"/>
        ))}

        {/* Route path */}
        {showRoute&&(
          <>
            <path d="M 110 330 Q 130 270 155 220 Q 180 170 215 147 Q 270 120 310 100 Q 360 80 420 70"
              fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="8" strokeLinecap="round" filter="url(#gf)"/>
            <path d="M 110 330 Q 130 270 155 220 Q 180 170 215 147 Q 270 120 310 100 Q 360 80 420 70"
              fill="none" stroke="url(#rg)" strokeWidth="2.5" strokeDasharray="10 5" strokeLinecap="round"/>
          </>
        )}

        {/* Rider pin */}
        {showRider&&(
          <g>
            <circle cx="110" cy="330" r="20" fill="rgba(8,145,178,0.12)" filter="url(#gf)"/>
            <circle cx="110" cy="330" r="10" fill="var(--c2)"/>
            <circle cx="110" cy="330" r="4"  fill="#fff"/>
            <circle cx="110" cy="330" r="10" fill="transparent" stroke="var(--c4)" strokeWidth="2" opacity="0.7">
              <animate attributeName="r"       from="10" to="24" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <rect x="80" y="308" width="60" height="16" rx="8" fill="rgba(8,145,178,0.25)" stroke="rgba(8,145,178,0.4)" strokeWidth="0.5"/>
            <text x="110" y="319" textAnchor="middle" fontSize="8" fill="var(--c4)" fontFamily="DM Sans,sans-serif" fontWeight="600">You</text>
          </g>
        )}

        {/* Driver pin */}
        {showDriver&&(
          <g>
            <circle cx="420" cy="70" r="20" fill="rgba(109,40,217,0.15)" filter="url(#gf)"/>
            <circle cx="420" cy="70" r="10" fill="var(--v2)"/>
            <circle cx="420" cy="70" r="4"  fill="#fff"/>
            <rect x="390" y="50" width="60" height="16" rx="8" fill="rgba(109,40,217,0.3)" stroke="rgba(139,92,246,0.4)" strokeWidth="0.5"/>
            <text x="420" y="61" textAnchor="middle" fontSize="8" fill="var(--v4)" fontFamily="DM Sans,sans-serif" fontWeight="600">Driver</text>
          </g>
        )}

        {/* Ambient dots */}
        {[[200,80],[380,200],[100,220],[500,280],[300,300]].map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r="2" fill={i%2===0?"rgba(139,92,246,0.3)":"rgba(34,211,238,0.3)"}/>
        ))}

        {/* Range ring */}
        {showRider&&(
          <>
            <circle cx="110" cy="330" r="55"  fill="rgba(8,145,178,0.03)" stroke="rgba(8,145,178,0.09)" strokeWidth="1" strokeDasharray="4 6"/>
            <circle cx="110" cy="330" r="100" fill="rgba(8,145,178,0.01)" stroke="rgba(8,145,178,0.05)" strokeWidth="1" strokeDasharray="4 8"/>
          </>
        )}
      </svg>

      {/* Map controls */}
      <div style={{ position:"absolute", top:14, right:14, display:"flex", flexDirection:"column", gap:6 }}>
        {[Plus, Minus].map((Icon,i)=>(
          <button key={i} style={{
            width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center",
            background:"rgba(10,10,30,0.85)", border:"1px solid var(--b2)", borderRadius:9,
            color:"var(--t2)", cursor:"pointer", transition:"all 0.15s",
          }}>
            <Icon size={13}/>
          </button>
        ))}
      </div>

      {/* Locate button */}
      <button style={{
        position:"absolute", bottom:14, right:14,
        width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
        background:"linear-gradient(135deg,var(--v),var(--v2))",
        border:"none", borderRadius:10, color:"#fff", cursor:"pointer",
        boxShadow:"var(--sh-v)",
      }}>
        <Navigation2 size={15}/>
      </button>
    </div>
  );
}
