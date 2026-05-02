// src/components/map/LiveMap.jsx — Cubiny v5
// BUG FIX: Replaces the fake SVG placeholder with real react-leaflet + OpenStreetMap.
// No API keys needed. Shows user location + nearby driver markers + animated route.
//
// INSTALL: npm install react-leaflet leaflet
//          (already added to package.json)
//
// NOTE: If you see grey tiles, run `npm install` first.

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── Fix Leaflet default icon paths broken by Vite bundling ───────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom SVG markers ────────────────────────────────────────────────────────
function svgIcon(color, letter) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="s" x="-40%" y="-20%" width="180%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="${color}" flood-opacity="0.5"/>
        </filter>
      </defs>
      <path d="M18 2C10.3 2 4 8.3 4 16c0 10.5 14 26 14 26S32 26.5 32 16C32 8.3 25.7 2 18 2z"
        fill="${color}" filter="url(#s)"/>
      <circle cx="18" cy="16" r="8" fill="white" opacity="0.95"/>
      <text x="18" y="20" text-anchor="middle" font-size="10" font-weight="700"
        font-family="system-ui" fill="${color}">${letter}</text>
    </svg>`;
  return L.divIcon({
    html: svg, className:"", iconSize:[36,44], iconAnchor:[18,44], popupAnchor:[0,-44],
  });
}

const RIDER_ICON  = svgIcon("#3b82f6", "You");
const DRIVER_ICONS = [
  svgIcon("#10b981", "H"),
  svgIcon("#8b5cf6", "A"),
  svgIcon("#f59e0b", "U"),
];

// ── Islamabad / Rawalpindi mock coordinates ───────────────────────────────────
const RIDER_POS  = [33.6750, 73.0500];   // F-7 Islamabad
const DRIVERS = [
  { id:"D1", pos:[33.6805, 73.0548], name:"Hassan Raza",  vehicle:"Toyota Corolla · LEJ-3421", rating:4.9, eta:"3 min" },
  { id:"D2", pos:[33.6690, 73.0440], name:"Ali Ahmad",    vehicle:"Honda Civic · RHD-7821",    rating:4.7, eta:"6 min" },
  { id:"D3", pos:[33.6870, 73.0390], name:"Usman Khan",   vehicle:"Suzuki Alto · ISB-4521",    rating:4.8, eta:"8 min" },
];

// ── Route polyline (mock GPS waypoints Islamabad) ────────────────────────────
const ROUTE_POINTS = [
  [33.6750, 73.0500], [33.6775, 73.0522], [33.6800, 73.0535],
  [33.6820, 73.0548], [33.6840, 73.0560], [33.6870, 73.0575],
];

// ── Sub-component: fit map bounds when route shown ────────────────────────────
function BoundsFitter({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding:[40,40] });
    }
  }, [map, points]);
  return null;
}

export function LiveMap({ showRoute = false, showRider = false, showDriver = false, compact = false }) {
  const [mapReady, setMapReady] = useState(false);

  const mapStyle = {
    width:"100%",
    height: compact ? 220 : "100%",
    minHeight: compact ? 220 : 400,
    borderRadius:"inherit",
    zIndex:0,
  };

  // Dark tile layer from CartoDB — matches our deep navy UI perfectly
  const TILE_URL   = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const TILE_ATTR  = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

  return (
    <div style={{ position:"relative", width:"100%", height:"100%", borderRadius:"inherit", overflow:"hidden" }}>
      <MapContainer
        center={RIDER_POS}
        zoom={14}
        style={mapStyle}
        zoomControl={false}
        attributionControl={true}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} maxZoom={19}/>

        {/* Rider position */}
        {showRider && (
          <>
            <Marker position={RIDER_POS} icon={RIDER_ICON}>
              <Popup>
                <strong>Your location</strong><br/>F-7 Markaz, Islamabad
              </Popup>
            </Marker>
            {/* Range ring */}
            <Circle center={RIDER_POS} radius={600}
              pathOptions={{ color:"#3b82f6", fillColor:"#3b82f6", fillOpacity:0.04, weight:1, dashArray:"6 8" }}/>
          </>
        )}

        {/* Nearby drivers */}
        {showDriver && DRIVERS.map((d, i) => (
          <Marker key={d.id} position={d.pos} icon={DRIVER_ICONS[i % DRIVER_ICONS.length]}>
            <Popup>
              <div style={{ minWidth:160 }}>
                <strong style={{ fontSize:13 }}>{d.name}</strong><br/>
                <span style={{ fontSize:11, color:"#64748b" }}>{d.vehicle}</span><br/>
                <span style={{ fontSize:11 }}>⭐ {d.rating} · {d.eta}</span>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Animated route polyline */}
        {showRoute && (
          <>
            {/* Glow layer */}
            <Polyline positions={ROUTE_POINTS}
              pathOptions={{ color:"#3b82f6", weight:8, opacity:0.15, lineCap:"round", lineJoin:"round" }}/>
            {/* Main route */}
            <Polyline positions={ROUTE_POINTS}
              pathOptions={{ color:"#60a5fa", weight:3, opacity:0.9, dashArray:"12 6", lineCap:"round" }}/>
            <BoundsFitter points={ROUTE_POINTS}/>
          </>
        )}
      </MapContainer>

      {/* Map overlay gradient to blend with UI */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to right, transparent 85%, rgba(10,15,30,0.4) 100%)",
      }}/>
    </div>
  );
}
