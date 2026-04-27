// src/services/ratingService.js
// ─────────────────────────────────────────────────────────────────
// Implements the rating trigger logic from PDF §5.
//
// PDF: "A trigger automatically flags a driver's account if their
//  average rating falls below 3.5 stars, notifying the admin."
//
// Mirrors MySQL trigger:
//   CREATE TRIGGER flag_low_rated_driver
//   AFTER UPDATE ON drivers FOR EACH ROW
//   BEGIN
//     IF NEW.averageRating < 3.5 THEN
//       UPDATE drivers SET accountStatus = 'Flagged' WHERE id = NEW.id;
//       INSERT INTO adminAlerts (driverId, reason) VALUES (NEW.id, 'Low Rating');
//     END IF;
//   END;
// ─────────────────────────────────────────────────────────────────

export const DRIVER_FLAG_THRESHOLD  = 3.5;
export const RIDER_FLAG_THRESHOLD   = 3.0;

/**
 * Checks if a driver should be flagged.
 * Mirrors the MySQL AFTER UPDATE trigger on the drivers table.
 */
export function checkDriverRatingTrigger(averageRating) {
  return {
    isFlagged: averageRating < DRIVER_FLAG_THRESHOLD,
    threshold: DRIVER_FLAG_THRESHOLD,
    delta:     (averageRating - DRIVER_FLAG_THRESHOLD).toFixed(2),
  };
}

/**
 * Checks if a rider should be warned.
 */
export function checkRiderRatingTrigger(averageRating) {
  return {
    isFlagged: averageRating < RIDER_FLAG_THRESHOLD,
    threshold: RIDER_FLAG_THRESHOLD,
  };
}

/**
 * Computes the average rating from an array of rating objects.
 * @param {Array<{score: number}>} ratings
 */
export function computeAverageRating(ratings = []) {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.score, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
}

/**
 * Returns a label and colour for a given score.
 */
export function getRatingMeta(score) {
  if (score >= 4.8) return { label: "Exceptional",  color: "#4ade80" };
  if (score >= 4.5) return { label: "Excellent",    color: "#86efac" };
  if (score >= 4.0) return { label: "Very Good",    color: "var(--c4)" };
  if (score >= 3.5) return { label: "Good",         color: "var(--amb)" };
  if (score >= 3.0) return { label: "Below Average",color: "#fb923c" };
  return               { label: "Poor",            color: "var(--red)" };
}
