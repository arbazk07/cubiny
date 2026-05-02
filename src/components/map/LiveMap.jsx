// src/components/map/LiveMap.jsx — Cubiny v6
// react-leaflet with light CartoDB Positron tiles — clean, professional
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Vite icon bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG markers
function svgMarker(fill, letter) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
    <filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${fill}" flood-opacity="0.4"/></filter>
    <path d="M17 2C9.8 2 4 7.8 4 15c0 9.8 13 25 13 25S30 24.8 30 15C30 7.8 24.2 2 17 2z" fill="${fill}" filter="url(#s)"/>
    <circle cx="17" cy="15" r="7.5" fill="white"/>
    <text x="17" y="19" text-anchor="middle" font-size="9" font-weight="800" font-family="Inter,sans-serif" fill="${fill}">${letter}</text>
  </svg>`;
  return L.divIcon({ html:svg, className:'', iconSize:[34,42], iconAnchor:[17,42], popupAnchor:[0,-44] });
}

const RIDER_ICON   = svgMarker('#2563EB', 'Me');
const DRIVER_ICONS = [svgMarker('#22C55E','H'), svgMarker('#F59E0B','A'), svgMarker('#0EA5E9','U')];

const RIDER_POS = [33.6750, 73.0500];
const DRIVERS   = [
  { id:'D1', pos:[33.6805,73.0548], name:'Hassan Raza',   vehicle:'Toyota Corolla · LEJ-3421', rating:4.9, eta:'3 min' },
  { id:'D2', pos:[33.6690,73.0440], name:'Ali Ahmad',     vehicle:'Honda Civic · RHD-7821',    rating:4.7, eta:'6 min' },
  { id:'D3', pos:[33.6870,73.0390], name:'Usman Khan',    vehicle:'Suzuki Alto · ISB-4521',    rating:4.8, eta:'8 min' },
];
const ROUTE_POINTS = [
  [33.6750,73.0500],[33.6775,73.0522],[33.6800,73.0535],
  [33.6820,73.0548],[33.6840,73.0560],[33.6870,73.0575],
];

function BoundsFitter({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding:[52,52] });
  }, [map, points]);
  return null;
}

// Light tile — CartoDB Positron (professional, clean, no API key)
const TILE_URL  = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export function LiveMap({ showRoute=false, showRider=true, showDriver=false }) {
  return (
    <div style={{ width:'100%', height:'100%', borderRadius:'inherit', overflow:'hidden', position:'relative' }}>
      <MapContainer
        center={RIDER_POS} zoom={14} zoomControl={false}
        style={{ width:'100%', height:'100%' }}
        attributionControl
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} maxZoom={19}/>

        {showRider && (
          <>
            <Marker position={RIDER_POS} icon={RIDER_ICON}>
              <Popup><strong style={{fontFamily:'Inter,sans-serif',fontSize:13}}>Your location</strong><br/><span style={{fontSize:12,color:'#64748B'}}>F-7 Markaz, Islamabad</span></Popup>
            </Marker>
            <Circle center={RIDER_POS} radius={550}
              pathOptions={{ color:'#2563EB', fillColor:'#2563EB', fillOpacity:0.05, weight:1.5, dashArray:'6 8' }}/>
          </>
        )}

        {showDriver && DRIVERS.map((d,i) => (
          <Marker key={d.id} position={d.pos} icon={DRIVER_ICONS[i%3]}>
            <Popup>
              <div style={{fontFamily:'Inter,sans-serif',minWidth:160,padding:'4px 0'}}>
                <strong style={{fontSize:13}}>{d.name}</strong><br/>
                <span style={{fontSize:11,color:'#64748B'}}>{d.vehicle}</span><br/>
                <span style={{fontSize:12,color:'#16A34A',fontWeight:600}}>⭐ {d.rating} · ETA {d.eta}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {showRoute && (
          <>
            <Polyline positions={ROUTE_POINTS} pathOptions={{ color:'#2563EB', weight:6, opacity:0.12, lineCap:'round' }}/>
            <Polyline positions={ROUTE_POINTS} pathOptions={{ color:'#2563EB', weight:3, opacity:0.85, dashArray:'10 6', lineCap:'round' }}/>
            <BoundsFitter points={ROUTE_POINTS}/>
          </>
        )}
      </MapContainer>
    </div>
  );
}
