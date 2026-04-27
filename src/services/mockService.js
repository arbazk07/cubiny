// src/services/mockService.js
// ─────────────────────────────────────────────────────────────────
// Wraps every mock data export in a simulated async call.
// Every function signature here matches the real API call that will
// replace it in Iteration 3.
//
// Pattern:
//   mockService.login(email, password)   ←→   api.post('/auth/login', ...)
//   mockService.getRideHistory(userId)   ←→   api.get(`/rides/history/${userId}`)
//
// This lets components call service functions and never know whether
// they're hitting mock data or a real MySQL backend.
// ─────────────────────────────────────────────────────────────────
import {
  MOCK_USERS, MOCK_ACTIVE_RIDES, MOCK_FLAGGED_DRIVERS,
  MOCK_PLATFORM_STATS, MOCK_RIDE_HISTORY, MOCK_EARNINGS_CHART,
  MOCK_INCOMING_RIDE, MOCK_PROMO_CODES, MOCK_COMPLAINTS,
  MOCK_REVENUE_BY_METHOD, MOCK_RATINGS, MOCK_WALLET_TRANSACTIONS,
} from "../data/mockData";

// Simulates network latency
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ── Auth ────────────────────────────────────────────────────────
// Iteration 3: api.post('/auth/login', { email, password })
export async function login(role) {
  await delay(900);
  const user = MOCK_USERS[role];
  if (!user) throw new Error("Invalid credentials");
  // Simulate a JWT token
  const token = `mock_jwt_${role}_${Date.now()}`;
  return { user, token };
}

// Iteration 3: api.post('/auth/logout')
export async function logout() {
  await delay(200);
  return { success: true };
}

// ── Rides ───────────────────────────────────────────────────────
// Iteration 3: api.get(`/rides/history/${userId}`)
export async function getRideHistory(userId) {
  await delay(500);
  return MOCK_RIDE_HISTORY;
}

// Iteration 3: api.get('/rides/active')
export async function getActiveRides() {
  await delay(400);
  return MOCK_ACTIVE_RIDES;
}

// Iteration 3: api.post('/rides/request', payload)
export async function requestRide(payload) {
  await delay(1200);
  return {
    id:     `RD-${Math.floor(8800 + Math.random() * 100)}`,
    status: "Requested",
    ...payload,
  };
}

// Iteration 3: api.patch(`/rides/${rideId}/cancel`)
export async function cancelRide(rideId) {
  await delay(600);
  return { success: true, rideId };
}

// ── Drivers ─────────────────────────────────────────────────────
// Iteration 3: api.get('/drivers/flagged')
export async function getFlaggedDrivers() {
  await delay(400);
  return MOCK_FLAGGED_DRIVERS;
}

// Iteration 3: api.patch(`/drivers/${driverId}/availability`, { status })
export async function setDriverAvailability(driverId, status) {
  await delay(300);
  return { driverId, status };
}

// Iteration 3: api.get(`/drivers/${driverId}/incoming-ride`)
export async function getIncomingRide(driverId) {
  await delay(3000); // simulates WebSocket delay
  return MOCK_INCOMING_RIDE;
}

// Iteration 3: api.patch(`/rides/${rideId}/accept`)
export async function acceptRide(rideId) {
  await delay(500);
  return { success: true, rideId };
}

// Iteration 3: api.patch(`/rides/${rideId}/decline`)
export async function declineRide(rideId) {
  await delay(300);
  return { success: true, rideId };
}

// ── Earnings ────────────────────────────────────────────────────
// Iteration 3: api.get(`/drivers/${driverId}/earnings?period=weekly`)
export async function getWeeklyEarnings(driverId) {
  await delay(400);
  return MOCK_EARNINGS_CHART;
}

// Iteration 3: api.post(`/drivers/${driverId}/payout`)
export async function requestPayout(driverId) {
  await delay(800);
  return { success: true, message: "Payout request submitted. Processing in 2–3 business days." };
}

// ── Vehicles ────────────────────────────────────────────────────
// Iteration 3: api.post('/vehicles/register', vehicleData)
export async function registerVehicle(vehicleData) {
  await delay(800);
  return { success: true, vehicleId: `V${Math.floor(100 + Math.random() * 900)}`, status: "Pending" };
}

// ── Wallet ──────────────────────────────────────────────────────
// Iteration 3: api.get(`/wallet/${userId}/transactions`)
export async function getWalletTransactions(userId) {
  await delay(400);
  return MOCK_WALLET_TRANSACTIONS;
}

// Iteration 3: api.post(`/wallet/${userId}/topup`, { amount, method })
export async function topUpWallet(userId, amount, method) {
  await delay(900);
  return { success: true, newBalance: 2340 + amount, transactionId: `TXN-${Date.now()}` };
}

// Iteration 3: api.post('/wallet/cards', cardData)
export async function saveCard(cardData) {
  await delay(700);
  return { success: true, last4: cardData.number?.slice(-4) ?? "****" };
}

// ── Promo codes ─────────────────────────────────────────────────
// Iteration 3: api.post('/promo/apply', { code, rideId })
export async function applyPromoCode(code) {
  await delay(600);
  const found = MOCK_PROMO_CODES.find(
    (p) => p.code === code.toUpperCase().trim() && !p.isUsed,
  );
  if (!found) throw new Error("Invalid or expired promo code");
  return { success: true, code: found.code, discount: found.discount };
}

// Iteration 3: api.get(`/promo/${userId}/codes`)
export async function getUserPromoCodes(userId) {
  await delay(400);
  return MOCK_PROMO_CODES;
}

// ── Ratings ─────────────────────────────────────────────────────
// Iteration 3: api.get(`/ratings/${userId}`)
export async function getUserRatings(userId) {
  await delay(500);
  return MOCK_RATINGS;
}

// Iteration 3: api.post('/ratings', ratingPayload)
export async function submitRating(rideId, ratedUserId, score, comment) {
  await delay(600);
  return { success: true, ratingId: `RAT-${Date.now()}` };
}

// ── Complaints ──────────────────────────────────────────────────
// Iteration 3: api.get(`/complaints/${userId}`)
export async function getUserComplaints(userId) {
  await delay(400);
  return MOCK_COMPLAINTS;
}

// Iteration 3: api.post('/complaints', { subject, message, userId })
export async function submitComplaint(subject, message, userId) {
  await delay(700);
  return { success: true, ticketId: `TK-${Math.floor(100 + Math.random() * 900)}` };
}

// ── Admin ───────────────────────────────────────────────────────
// Iteration 3: api.get('/admin/stats')
export async function getPlatformStats() {
  await delay(400);
  return MOCK_PLATFORM_STATS;
}

// Iteration 3: api.get('/admin/revenue-by-method')
export async function getRevenueByMethod() {
  await delay(400);
  return MOCK_REVENUE_BY_METHOD;
}

// Iteration 3: api.patch(`/admin/drivers/${driverId}/status`, { status })
export async function updateDriverStatus(driverId, status) {
  await delay(500);
  return { success: true, driverId, status };
}
