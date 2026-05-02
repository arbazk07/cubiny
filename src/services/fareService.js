// src/services/fareService.js  —  Cubiny Iteration 3
// ─────────────────────────────────────────────────────────────────
// When VITE_USE_MOCK=false, fare calculations are done server-side
// via the CalculateSurgeFare stored procedure.
// This file keeps the local logic as a fallback / offline mode.
// ─────────────────────────────────────────────────────────────────
import { FARE_CONFIG, SURGE_CONFIG } from "../data/mockData";

/**
 * Local surge multiplier — mirrors CalculateSurgeFare stored procedure.
 * Used only when VITE_USE_MOCK=true (offline/demo mode).
 */
export function getSurgeMultiplier() {
  const hour  = new Date().getHours();
  const match = SURGE_CONFIG.peakHours.find(p => hour >= p.start && hour < p.end);
  return {
    multiplier:  match?.multiplier ?? SURGE_CONFIG.defaultMultiplier,
    surgeApplied: Boolean(match),
    surgeLabel:  match?.label ?? null,
  };
}

/**
 * Local fare calculation.
 * Formula from PDF §4:
 *   fare = (baseRate + perKmRate×dist + perMinRate×dur) × surgeMultiplier
 */
export function calcFare(vehicleType, distanceKm = 7.2, durationMin = 18, promoDiscount = 0) {
  const cfg = FARE_CONFIG[vehicleType] ?? FARE_CONFIG.Economy;
  const { multiplier, surgeApplied, surgeLabel } = getSurgeMultiplier();

  const baseFare   = cfg.baseRate + cfg.perKmRate * distanceKm + cfg.perMinuteRate * durationMin;
  const surgedFare = baseFare * multiplier;
  const discount   = Math.round(surgedFare * promoDiscount);
  const finalFare  = Math.round(surgedFare - discount);

  return {
    fare: Math.round(surgedFare),
    baseFare: Math.round(baseFare),
    surgeApplied,
    multiplier,
    surgeLabel,
    discount,
    finalFare,
  };
}

/**
 * Returns all vehicle types with pre-calculated fares.
 */
export function getAllFares(distanceKm = 7.2, durationMin = 18) {
  return Object.entries(FARE_CONFIG).map(([type, cfg]) => ({
    id:    type,
    label: cfg.label,
    eta:   cfg.eta,
    ...calcFare(type, distanceKm, durationMin),
  }));
}
