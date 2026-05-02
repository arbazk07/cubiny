// src/components/ui/StatusPill.jsx — Cubiny v6
const MAP = {
  'Completed':       'pill-green',
  'In Progress':     'pill-blue',
  'Driver En Route': 'pill-sky',
  'En Route':        'pill-sky',
  'Accepted':        'pill-blue',
  'Requested':       'pill-amber',
  'Searching':       'pill-amber',
  'Cancelled':       'pill-red',
  'Pending':         'pill-amber',
  'Active':          'pill-green',
  'Online':          'pill-green',
  'Offline':         'pill-gray',
  'Flagged':         'pill-red',
  'Verified':        'pill-green',
  'Suspended':       'pill-red',
};
const DOT = {
  'pill-green':'#22C55E','pill-blue':'#2563EB','pill-sky':'#0EA5E9',
  'pill-amber':'#F59E0B','pill-red':'#EF4444','pill-gray':'#94A3B8',
};
export function StatusPill({ status }) {
  const cls = MAP[status] ?? 'pill-gray';
  return (
    <span className={`pill ${cls}`}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:DOT[cls]??'#94A3B8', flexShrink:0 }}/>
      {status}
    </span>
  );
}
