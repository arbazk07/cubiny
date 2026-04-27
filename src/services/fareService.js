// src/services/fareService.js
// ─────────────────────────────────────────────────────────────────
// Implements the fare calculation logic from PDF §4.
//
// Formula:  fare = (baseRate + perKmRate×dist + perMinRate×duration)
//                  × surgeMultiplier
//                  × (1 − promoDiscount)
//
// Iteration 3: FARE_CONFIG and SURGE_CONFIG are fetched from the
//   MySQL fareConfig / surgeConfig tables via api.js.
// ─────────────────────────────────────────────────────────────────
import { FARE_CONFIG, SURGE_CONFIG } from "../data/mockData";

/**
 * Returns the active surge multiplier based on current hour.
 * Mirrors: CALL calculateSurgeMultiplier() stored procedure (PDF §4).
 */
export function getSurgeMultiplier() {
  const hour = new Date().getHours();
  const match = SURGE_CONFIG.peakHours.find(
    (p) => hour >= p.start && hour < p.end,
  );
  return {
    multiplier:  match?.multiplier ?? SURGE_CONFIG.defaultMultiplier,
    surgeApplied: Boolean(match),
    surgeLabel:  match?.label ?? null,
  };
}

/**
 * Calculates the full fare for a ride.
 *
 * @param {string} vehicleType   "Economy" | "Premium" | "Bike"
 * @param {number} distanceKm    Route distance in kilometres
 * @param {number} durationMin   Estimated trip duration in minutes
 * @param {number} promoDiscount Fractional discount, e.g. 0.5 for 50% off
 * @returns {{ fare, baseFare, surgeApplied, multiplier, surgeLabel, discount, finalFare }}
 */
export function calcFare(vehicleType, distanceKm = 7.2, durationMin = 18, promoDiscount = 0) {
  const cfg = FARE_CONFIG[vehicleType] ?? FARE_CONFIG.Economy;
  const { multiplier, surgeApplied, surgeLabel } = getSurgeMultiplier();

  const baseFare    = cfg.baseRate + cfg.perKmRate * distanceKm + cfg.perMinuteRate * durationMin;
  const surgedFare  = baseFare * multiplier;
  const discount    = Math.round(surgedFare * promoDiscount);
  const finalFare   = Math.round(surgedFare - discount);

  return {
    fare:         Math.round(surgedFare), // before promo
    baseFare:     Math.round(baseFare),
    surgeApplied,
    multiplier,
    surgeLabel,
    discount,
    finalFare,                             // after promo
  };
}

/**
 * Returns all vehicle types with pre-calculated fares.
 * Used to render the ride type selector cards.
 */
export function getAllFares(distanceKm = 7.2, durationMin = 18) {
  return Object.entries(FARE_CONFIG).map(([type, cfg]) => ({
    id:    type,
    label: cfg.label,
    eta:   cfg.eta,
    ...calcFare(type, distanceKm, durationMin),
  }));
}
