// src/components/ui/Avatar.jsx — Cubiny v6
const COLORS = [
  ['#DCFCE7','#16A34A'], ['#DBEAFE','#1D4ED8'], ['#FEF3C7','#92400E'],
  ['#FEE2E2','#991B1B'], ['#F3E8FF','#7E22CE'], ['#E0F2FE','#0369A1'],
];
function colorFor(str='') {
  const i = str.charCodeAt(0) % COLORS.length;
  return COLORS[i];
}
export function Avatar({ initials='?', size=38, status }) {
  const [bg, fg] = colorFor(initials);
  const dot = { online:'#22C55E', offline:'#94A3B8', busy:'#F59E0B' };
  return (
    <div style={{ position:'relative', flexShrink:0, width:size, height:size }}>
      <div style={{
        width:size, height:size, borderRadius:'50%',
        background:bg, color:fg,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontWeight:700, fontSize:size*0.36, userSelect:'none',
        border:`1.5px solid ${fg}22`, letterSpacing:'-0.01em',
      }}>
        {initials.slice(0,2).toUpperCase()}
      </div>
      {status && (
        <span style={{
          position:'absolute', bottom:0, right:0,
          width:size*0.27, height:size*0.27, borderRadius:'50%',
          background:dot[status]??'#94A3B8',
          border:`2px solid white`,
          boxShadow:`0 0 0 1px ${dot[status]??'#94A3B8'}22`,
        }}/>
      )}
    </div>
  );
}
