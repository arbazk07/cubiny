// src/services/fareService.js — Cubiny v5
// BUG FIX: Added NaN guard — distanceKm and durationMin must be positive numbers.
//          Previously, passing undefined caused Rs. NaN to render on screen.
const BASE_RATES = {
  Economy: { perKm: 45,  perMin: 3,  base: 100 },
  Premium: { perKm: 75,  perMin: 6,  base: 200 },
  Bike:    { perKm: 25,  perMin: 2,  base: 60  },
};

const SURGE_RULES = [
  { from: 17, to: 20, multiplier: 1.5, label: "Evening Peak" },
  { from: 8,  to: 10, multiplier: 1.3, label: "Morning Rush"  },
  { from: 0,  to: 5,  multiplier: 1.2, label: "Late Night"    },
];

function getCurrentSurge() {
  const hour = new Date().getHours();
  return SURGE_RULES.find(r => hour >= r.from && hour < r.to) ?? null;
}

export function calcFare(type = "Economy", distanceKm, durationMin) {
  // ← BUG FIX: guard NaN inputs
  const dist = Math.max(0, Number(distanceKm) || 0);
  const dur  = Math.max(0, Number(durationMin) || 0);
  const rate = BASE_RATES[type] ?? BASE_RATES.Economy;
  const base = rate.base + dist * rate.perKm + dur * rate.perMin;

  const surge = getCurrentSurge();
  const mult  = surge ? surge.multiplier : 1;
  const final = Math.round(base * mult);

  const etaMin = Math.round(dur * 0.9 + dist * 1.2);

  return {
    id:           type,
    baseFare:     Math.round(base),
    finalFare:    final,
    multiplier:   mult,
    surgeApplied: mult > 1,
    surgeLabel:   surge?.label ?? null,
    eta:          `~${etaMin} min`,
    currency:     "PKR",
  };
}

export function getAllFares(distanceKm, durationMin) {
  return Object.keys(BASE_RATES).map(t => calcFare(t, distanceKm, durationMin));
}
