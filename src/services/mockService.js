// src/services/mockService.js  —  Cubiny Iteration 3
// ─────────────────────────────────────────────────────────────────
// ALL functions now call the real Node.js/MySQL backend via api.js.
// Mock data fallback is only used if VITE_USE_MOCK=true in .env.
// ─────────────────────────────────────────────────────────────────
import api from "./api";
import * as mock from "../data/mockData";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const delay    = (ms = 600) => new Promise(r => setTimeout(r, ms));

// ── Helper: unwrap axios response ─────────────────────────────────
const unwrap = (res) => res.data.data;

// ── Auth ──────────────────────────────────────────────────────────
export async function login(role, email, password) {
  if (USE_MOCK) {
    await delay(900);
    const user  = mock.MOCK_USERS[role];
    if (!user) throw new Error("Invalid credentials");
    return { user, token: `mock_jwt_${role}_${Date.now()}` };
  }
  const res = await api.post("/auth/login", { email, password });
  return { user: res.data.data.user, token: res.data.data.accessToken };
}

export async function register(payload) {
  if (USE_MOCK) { await delay(900); return { success: true }; }
  return unwrap(await api.post("/auth/register", payload));
}

export async function logout() {
  if (USE_MOCK) { await delay(200); return; }
  const refresh = localStorage.getItem("cubiny_refresh");
  await api.post("/auth/logout", { refreshToken: refresh });
}

export async function getMe() {
  if (USE_MOCK) { await delay(200); return null; }
  return unwrap(await api.get("/auth/me"));
}

// ── Rides ─────────────────────────────────────────────────────────
export async function getFares(distanceKm = 7.2, durationMin = 18) {
  if (USE_MOCK) {
    await delay(300);
    const { getAllFares } = await import("./fareService");
    return getAllFares(distanceKm, durationMin);
  }
  return unwrap(await api.get("/rides/fares", { params: { distance: distanceKm, duration: durationMin } }));
}

export async function requestRide(payload) {
  if (USE_MOCK) {
    await delay(1200);
    return { id: `RD-${Math.floor(8800 + Math.random() * 100)}`, status: "Requested", ...payload };
  }
  return unwrap(await api.post("/rides/request", payload));
}

export async function updateRideStatus(rideId, status, extra = {}) {
  if (USE_MOCK) { await delay(400); return { status }; }
  return unwrap(await api.patch(`/rides/${rideId}/status`, { status, ...extra }));
}

export async function getRideHistory() {
  if (USE_MOCK) { await delay(500); return mock.MOCK_RIDE_HISTORY; }
  return unwrap(await api.get("/rides/history"));
}

export async function getActiveRides() {
  if (USE_MOCK) { await delay(400); return mock.MOCK_ACTIVE_RIDES; }
  return unwrap(await api.get("/rides/active"));
}

// ── Drivers ───────────────────────────────────────────────────────
export async function getDriverProfile() {
  if (USE_MOCK) { await delay(300); return mock.MOCK_USERS.driver; }
  return unwrap(await api.get("/drivers/me"));
}

export async function setDriverAvailability(status) {
  if (USE_MOCK) { await delay(300); return { status }; }
  return unwrap(await api.patch("/drivers/availability", { status }));
}

export async function getIncomingRide() {
  if (USE_MOCK) { await delay(3000); return mock.MOCK_INCOMING_RIDE; }
  // In production this is a WebSocket event, not a REST poll.
  // This REST fallback is for environments without WS support.
  return unwrap(await api.get("/drivers/incoming-ride"));
}

export async function acceptRide(rideId) {
  if (USE_MOCK) { await delay(500); return { success: true }; }
  return unwrap(await api.patch(`/rides/${rideId}/status`, { status: "Accepted" }));
}

export async function declineRide(rideId) {
  if (USE_MOCK) { await delay(300); return { success: true }; }
  return unwrap(await api.patch(`/rides/${rideId}/status`, { status: "Cancelled", reason: "Driver declined" }));
}

// ── Earnings ──────────────────────────────────────────────────────
export async function getWeeklyEarnings() {
  if (USE_MOCK) { await delay(400); return mock.MOCK_EARNINGS_CHART; }
  const data = unwrap(await api.get("/drivers/earnings"));
  // Normalize to { day, amount } shape for chart
  return data.daily?.map(e => ({ day: e.day?.slice(0, 3), amount: parseFloat(e.amount) })) ?? [];
}

export async function requestPayout() {
  if (USE_MOCK) { await delay(800); return { success: true, message: "Payout request submitted." }; }
  return unwrap(await api.post("/drivers/payout"));
}

// ── Vehicles ──────────────────────────────────────────────────────
export async function registerVehicle(vehicleData) {
  if (USE_MOCK) {
    await delay(800);
    return { success: true, vehicleId: `V${Math.floor(100 + Math.random() * 900)}`, status: "Pending" };
  }
  return unwrap(await api.post("/drivers/vehicles", vehicleData));
}

export async function getVehicles() {
  if (USE_MOCK) { await delay(300); return [mock.MOCK_USERS.driver.vehicle]; }
  return unwrap(await api.get("/drivers/vehicles"));
}

// ── Wallet ────────────────────────────────────────────────────────
export async function getWalletTransactions() {
  if (USE_MOCK) { await delay(400); return mock.MOCK_WALLET_TRANSACTIONS; }
  return unwrap(await api.get("/wallet/transactions"));
}

export async function topUpWallet(amount, method) {
  if (USE_MOCK) { await delay(900); return { success: true }; }
  return unwrap(await api.post("/wallet/topup", { amount, method }));
}

export async function saveCard(cardData) {
  if (USE_MOCK) { await delay(700); return { success: true }; }
  return unwrap(await api.post("/wallet/cards", cardData));
}

// ── Promo codes ───────────────────────────────────────────────────
export async function getUserPromoCodes() {
  if (USE_MOCK) { await delay(400); return mock.MOCK_PROMO_CODES; }
  return unwrap(await api.get("/promos"));
}

export async function applyPromoCode(code) {
  if (USE_MOCK) {
    await delay(600);
    const found = mock.MOCK_PROMO_CODES.find(p => p.code === code.toUpperCase().trim() && !p.isUsed);
    if (!found) throw new Error("Invalid or expired promo code");
    return { success: true, code: found.code, discount: found.discount };
  }
  return unwrap(await api.post("/promos/validate", { code }));
}

// ── Ratings ───────────────────────────────────────────────────────
export async function getUserRatings(userId) {
  if (USE_MOCK) { await delay(500); return mock.MOCK_RATINGS; }
  return unwrap(await api.get(`/ratings/${userId}`));
}

export async function submitRating(rideId, ratedUserId, score, comment) {
  if (USE_MOCK) { await delay(600); return { success: true }; }
  return unwrap(await api.post("/ratings", { ride_id: rideId, rated_user_id: ratedUserId, score, comment }));
}

// ── Complaints ────────────────────────────────────────────────────
export async function getUserComplaints() {
  if (USE_MOCK) { await delay(400); return mock.MOCK_COMPLAINTS; }
  return unwrap(await api.get("/complaints"));
}

export async function submitComplaint(subject, message, category) {
  if (USE_MOCK) {
    await delay(700);
    return { success: true, ticketId: `TK-${Math.floor(100 + Math.random() * 900)}` };
  }
  return unwrap(await api.post("/complaints", { subject, description: message, category }));
}

// ── Admin ─────────────────────────────────────────────────────────
export async function getPlatformStats() {
  if (USE_MOCK) { await delay(400); return mock.MOCK_PLATFORM_STATS; }
  return unwrap(await api.get("/admin/stats"));
}

export async function getRevenueByMethod() {
  if (USE_MOCK) { await delay(400); return mock.MOCK_REVENUE_BY_METHOD; }
  const data = unwrap(await api.get("/admin/revenue"));
  return data.byMethod ?? [];
}

export async function getFlaggedDrivers() {
  if (USE_MOCK) { await delay(400); return mock.MOCK_FLAGGED_DRIVERS; }
  return unwrap(await api.get("/ratings/admin/flagged"));
}

export async function updateDriverStatus(driverId, status) {
  if (USE_MOCK) { await delay(500); return { success: true }; }
  return unwrap(await api.patch(`/admin/users/${driverId}/status`, { status }));
}
