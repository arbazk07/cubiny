// src/data/mockData.js  ─ Cubiny v2
// In Iteration 2, this is consumed by /src/services/mockService.js
// which wraps every export in a simulated async call.
// Iteration 3: mockService.js is replaced by real axios calls to Node/MySQL.

export const MOCK_USERS = {
  rider: {
    id: "R001", name: "Aisha Malik", email: "aisha@cubiny.pk",
    avatar: "AM", role: "rider", wallet: 4750, rating: 4.8,
    totalRides: 47, accountStatus: "Active", city: "Islamabad",
  },
  driver: {
    id: "D001", name: "Hassan Raza", email: "hassan@cubiny.pk",
    avatar: "HR", role: "driver", rating: 4.9, totalTrips: 312,
    earnings: 84500, weeklyEarnings: 6200, verified: true,
    licenseNo: "LHR-2021-4892", cnic: "35202-1234567-9",
    availabilityStatus: "Offline",
    vehicle: { vehicleId:"V001", make:"Toyota", model:"Corolla", year:2021, color:"White", plate:"LEJ-3421", type:"Economy", verificationStatus:"Verified" },
  },
  admin: { id:"A001", name:"Admin", email:"admin@cubiny.pk", avatar:"AD", role:"admin" },
};

export const MOCK_ACTIVE_RIDES = [
  { id:"RD-8821", rider:"Bilal Ahmed",  driver:"Kamran Ali",  from:"F-7 Markaz",  to:"Blue Area",    fare:420, status:"In Progress",    elapsedTime:"12 min", surgeApplied:false, surgeMultiplier:1.0 },
  { id:"RD-8820", rider:"Sara Khan",    driver:"Usman Butt",  from:"Bahria Town", to:"Centaurus",    fare:680, status:"Driver En Route", elapsedTime:"4 min",  surgeApplied:true,  surgeMultiplier:1.5 },
  { id:"RD-8819", rider:"Ali Raza",     driver:"Pending",     from:"PWD",         to:"I-8 Markaz",   fare:350, status:"Requested",       elapsedTime:"--",     surgeApplied:false, surgeMultiplier:1.0 },
  { id:"RD-8818", rider:"Hira Baig",    driver:"Asad Malik",  from:"E-11",        to:"F-10 Markaz",  fare:290, status:"Accepted",        elapsedTime:"2 min",  surgeApplied:false, surgeMultiplier:1.0 },
];

export const MOCK_FLAGGED_DRIVERS = [
  { id:"D045", name:"Zain ul Abideen", rating:3.1, trips:89,  issue:"Low Rating",    accountStatus:"Flagged" },
  { id:"D032", name:"Farhan Sheikh",   rating:3.4, trips:54,  issue:"Complaints x3", accountStatus:"Flagged" },
];

export const MOCK_PLATFORM_STATS = {
  totalRevenue:2847600, activeRides:38, registeredDrivers:1240,
  registeredRiders:8904, todayRevenue:182400, totalTripsAllTime:94210,
};

export const MOCK_RIDE_HISTORY = [
  { id:"RD-8801", from:"F-10", to:"G-9",        fare:280, date:"Today, 9:14 AM",     status:"Completed", driver:"Rizwan Khan",  driverRating:5   },
  { id:"RD-8795", from:"E-7",  to:"Centaurus",  fare:450, date:"Yesterday, 6:30 PM", status:"Completed", driver:"Nadir Shah",   driverRating:4   },
  { id:"RD-8781", from:"Bahria Ph.1", to:"PWD", fare:620, date:"Apr 17, 3:10 PM",    status:"Cancelled", driver:"N/A",          driverRating:null},
  { id:"RD-8760", from:"G-11", to:"F-7 Markaz", fare:310, date:"Apr 14, 11:00 AM",   status:"Completed", driver:"Kamil Hassan",  driverRating:5  },
];

export const MOCK_EARNINGS_CHART = [
  {day:"Mon",amount:820},{day:"Tue",amount:1240},{day:"Wed",amount:960},
  {day:"Thu",amount:1580},{day:"Fri",amount:2100},{day:"Sat",amount:1820},{day:"Sun",amount:680},
];

export const MOCK_INCOMING_RIDE = {
  id:"RD-8823", rider:"Fatima Zahra", riderRating:4.7,
  from:"D-12 Markaz", to:"F-6/2", distanceKm:7.2, fare:480, driverEta:"3 min away",
  surgeApplied:false,
};

export const MOCK_PROMO_CODES = [
  { code:"CUBINY50", discount:"50% off",     expiry:"Apr 30", isUsed:false },
  { code:"NEWRIDE",  discount:"Rs. 100 off", expiry:"May 15", isUsed:true  },
  { code:"ISLOO20",  discount:"20% off",     expiry:"May 31", isUsed:false },
];

export const MOCK_COMPLAINTS = [
  { id:"TK-001", subject:"Driver was rude",   date:"Apr 18", status:"Open"     },
  { id:"TK-002", subject:"Wrong route taken", date:"Apr 15", status:"Resolved" },
];

export const MOCK_REVENUE_BY_METHOD = [
  { method:"Cash",   pct:42, color:"var(--v2)"  },
  { method:"Wallet", pct:35, color:"var(--c2)"  },
  { method:"Card",   pct:23, color:"var(--amb)" },
];

export const MOCK_RATINGS = [
  { from:"Fatima Z.", score:5, comment:"Very punctual and professional!", date:"Apr 20" },
  { from:"Ali R.",    score:4, comment:"Good service, clean car.",         date:"Apr 18" },
  { from:"Sara K.",   score:5, comment:"Excellent experience!",            date:"Apr 17" },
  { from:"Bilal A.",  score:4, comment:null,                               date:"Apr 15" },
];

// ── Fare config ─ mirrors fareConfig table ──────────────────────
// Formula (PDF §4): baseFare = baseRate + (perKmRate × dist) + (perMinRate × duration)
export const FARE_CONFIG = {
  Economy: { baseRate:80,  perKmRate:30, perMinuteRate:3,  label:"Economy", eta:"5 min" },
  Premium: { baseRate:150, perKmRate:55, perMinuteRate:6,  label:"Premium", eta:"8 min" },
  Bike:    { baseRate:40,  perKmRate:18, perMinuteRate:2,  label:"Bike",    eta:"3 min" },
};

// ── Surge config ─ mirrors surgeConfig table ────────────────────
export const SURGE_CONFIG = {
  peakHours:[
    { start:7,  end:10, multiplier:1.5, label:"Morning Rush" },
    { start:17, end:21, multiplier:1.8, label:"Evening Rush" },
  ],
  defaultMultiplier:1.0,
};

// ── Wallet transactions ─────────────────────────────────────────
export const MOCK_WALLET_TRANSACTIONS = [
  { id:"TXN-001", type:"debit",  desc:"Ride F-10 → G-9",    amount:280, date:"Today, 9:14 AM",     method:"Wallet" },
  { id:"TXN-002", type:"credit", desc:"Wallet Top-up",       amount:1000,date:"Yesterday, 4:00 PM", method:"Card"   },
  { id:"TXN-003", type:"debit",  desc:"Ride E-7 → Centaurus",amount:450,date:"Apr 17, 6:30 PM",    method:"Wallet" },
  { id:"TXN-004", type:"credit", desc:"Refund – TK-002",     amount:620, date:"Apr 16, 2:10 PM",    method:"System" },
];
