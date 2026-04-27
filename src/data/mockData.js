// src/data/mockData.js
// ─────────────────────────────────────────────────────────────────
// Single source of truth for all mock API responses.
// Every export mirrors what the MySQL backend will return.
// Iteration 2: each export gets replaced by a real axios call.
// ─────────────────────────────────────────────────────────────────

export const MOCK_USERS = {
  rider: {
    id: "R001",
    name: "Aisha Malik",
    email: "aisha@example.com",
    avatar: "AM",
    role: "rider",
    wallet: 2340,
    rating: 4.8,
    totalRides: 47,
    accountStatus: "Active",
  },
  driver: {
    id: "D001",
    name: "Hassan Raza",
    email: "hassan@example.com",
    avatar: "HR",
    role: "driver",
    rating: 4.9,
    totalTrips: 312,
    earnings: 84500,
    weeklyEarnings: 6200,
    verified: true,
    licenseNo: "LHR-2021-4892",
    cnic: "35202-1234567-9",
    availabilityStatus: "Offline",
    vehicle: {
      vehicleId: "V001",
      make: "Toyota",
      model: "Corolla",
      year: 2021,
      color: "White",
      plate: "LEJ-3421",
      type: "Economy",
      verificationStatus: "Verified",
    },
  },
  admin: {
    id: "A001",
    name: "Admin",
    email: "admin@izenrides.com",
    avatar: "AD",
    role: "admin",
  },
};

// Mirrors: SELECT * FROM rides WHERE status NOT IN ('Completed','Cancelled')
export const MOCK_ACTIVE_RIDES = [
  {
    id: "RD-8821",
    riderId: "R004",
    rider: "Bilal Ahmed",
    driverId: "D012",
    driver: "Kamran Ali",
    from: "F-7 Markaz",
    to: "Blue Area",
    fare: 420,
    status: "In Progress",
    elapsedTime: "12 min",
    surgeApplied: false,
    surgeMultiplier: 1.0,
  },
  {
    id: "RD-8820",
    riderId: "R007",
    rider: "Sara Khan",
    driverId: "D008",
    driver: "Usman Butt",
    from: "Bahria Town",
    to: "Centaurus",
    fare: 680,
    status: "Driver En Route",
    elapsedTime: "4 min",
    surgeApplied: true,
    surgeMultiplier: 1.5,
  },
  {
    id: "RD-8819",
    riderId: "R011",
    rider: "Ali Raza",
    driverId: null,
    driver: "Pending",
    from: "PWD",
    to: "I-8 Markaz",
    fare: 350,
    status: "Requested",
    elapsedTime: "--",
    surgeApplied: false,
    surgeMultiplier: 1.0,
  },
];

// Mirrors: SELECT * FROM drivers WHERE averageRating < 3.5
export const MOCK_FLAGGED_DRIVERS = [
  { id: "D045", name: "Zain ul Abideen", rating: 3.1, trips: 89,  issue: "Low Rating",    accountStatus: "Flagged" },
  { id: "D032", name: "Farhan Sheikh",   rating: 3.4, trips: 54,  issue: "Complaints x3", accountStatus: "Flagged" },
];

// Mirrors: Platform-level aggregate stats query
export const MOCK_PLATFORM_STATS = {
  totalRevenue:      2847600,
  activeRides:       38,
  registeredDrivers: 1240,
  registeredRiders:  8904,
  todayRevenue:      182400,
};

// Mirrors: SELECT * FROM rides WHERE riderId = :id ORDER BY createdAt DESC
export const MOCK_RIDE_HISTORY = [
  { id: "RD-8801", from: "F-10",        to: "G-9",       fare: 280, date: "Today, 9:14 AM",     status: "Completed", driver: "Rizwan Khan", driverRating: 5   },
  { id: "RD-8795", from: "E-7",         to: "Centaurus", fare: 450, date: "Yesterday, 6:30 PM", status: "Completed", driver: "Nadir Shah",  driverRating: 4   },
  { id: "RD-8781", from: "Bahria Ph.1", to: "PWD",       fare: 620, date: "Apr 17, 3:10 PM",    status: "Cancelled", driver: "N/A",         driverRating: null },
];

// Mirrors: SELECT * FROM earnings WHERE driverId = :id GROUP BY dayOfWeek
export const MOCK_EARNINGS_CHART = [
  { day: "Mon", amount: 820  },
  { day: "Tue", amount: 1240 },
  { day: "Wed", amount: 960  },
  { day: "Thu", amount: 1580 },
  { day: "Fri", amount: 2100 },
  { day: "Sat", amount: 1820 },
  { day: "Sun", amount: 680  },
];

// Mirrors: Incoming ride broadcast (WebSocket event in production)
export const MOCK_INCOMING_RIDE = {
  id: "RD-8823",
  rider: "Fatima Zahra",
  riderRating: 4.7,
  from: "D-12 Markaz",
  to: "F-6/2",
  distanceKm: 7.2,
  fare: 480,
  driverEta: "3 min away",
  surgeApplied: false,
};

// Mirrors: SELECT * FROM promoCodes WHERE riderId = :id
export const MOCK_PROMO_CODES = [
  { code: "ISLOO50", discount: "50% off",     expiry: "Apr 30", isUsed: false },
  { code: "NEWRIDE", discount: "Rs. 100 off", expiry: "May 15", isUsed: true  },
];

// Mirrors: SELECT * FROM complaints WHERE userId = :id ORDER BY createdAt DESC
export const MOCK_COMPLAINTS = [
  { id: "TK-001", subject: "Driver was rude",   date: "Apr 18", status: "Open"     },
  { id: "TK-002", subject: "Wrong route taken", date: "Apr 15", status: "Resolved" },
];

// Mirrors: Revenue aggregated by paymentMethod
export const MOCK_REVENUE_BY_METHOD = [
  { method: "Cash",   pct: 42 },
  { method: "Wallet", pct: 35 },
  { method: "Card",   pct: 23 },
];

// Mirrors: SELECT * FROM ratings WHERE ratedUserId = :id ORDER BY createdAt DESC
export const MOCK_RATINGS = [
  { from: "Fatima Z.", score: 5, comment: "Very punctual and professional!", date: "Apr 20" },
  { from: "Ali R.",    score: 4, comment: "Good service, clean car.",        date: "Apr 18" },
  { from: "Sara K.",   score: 5, comment: "Excellent experience!",           date: "Apr 17" },
  { from: "Bilal A.",  score: 4, comment: null,                              date: "Apr 15" },
];

// ── Fare config ─────────────────────────────────────────────────
// Mirrors: SELECT * FROM fareConfig WHERE vehicleType = :type
// Formula: baseFare = baseRate + (perKmRate × distance) + (perMinuteRate × duration)
export const FARE_CONFIG = {
  Economy: { baseRate: 80,  perKmRate: 30, perMinuteRate: 3 },
  Premium: { baseRate: 150, perKmRate: 55, perMinuteRate: 6 },
  Bike:    { baseRate: 40,  perKmRate: 18, perMinuteRate: 2 },
};

// ── Surge config ────────────────────────────────────────────────
// Mirrors: SELECT * FROM surgeConfig
// Iteration 3: this logic moves to fareService.js with DB-backed config
export const SURGE_CONFIG = {
  peakHours: [
    { start: 8,  end: 10, multiplier: 1.5 },  // Morning rush
    { start: 17, end: 20, multiplier: 1.8 },  // Evening rush
  ],
  defaultMultiplier: 1.0,
};
