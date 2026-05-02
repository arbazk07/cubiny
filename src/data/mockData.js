// src/data/mockData.js — Cubiny v5
// BUG FIX: MOCK_WALLET_TRANSACTIONS was referenced by mockService but never defined
//          causing a runtime crash on the WalletPage. Added below.
// All mock data updated to reflect accurate schema field names.

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
    vehicle: {
      vehicleId:"V001", make:"Toyota", model:"Corolla", year:2021,
      color:"White", plate:"LEJ-3421", type:"Economy",
      verificationStatus:"Verified",
    },
  },
  admin: { id:"A001", name:"Sana Admin", email:"admin@cubiny.pk", avatar:"SA", role:"admin" },
};

export const MOCK_ACTIVE_RIDES = [
  { id:"RD-8821", rider:"Bilal Ahmed", driver:"Kamran Ali",  from:"F-7 Markaz",  to:"Blue Area",   fare:420, status:"In Progress",    elapsedTime:"12 min", surgeApplied:false, surgeMultiplier:1.0 },
  { id:"RD-8820", rider:"Sara Khan",   driver:"Usman Butt",  from:"Bahria Town", to:"Centaurus",   fare:680, status:"Driver En Route", elapsedTime:"4 min",  surgeApplied:true,  surgeMultiplier:1.5 },
  { id:"RD-8819", rider:"Ali Raza",    driver:"Pending",     from:"PWD",         to:"I-8 Markaz",  fare:350, status:"Requested",       elapsedTime:"--",     surgeApplied:false, surgeMultiplier:1.0 },
  { id:"RD-8818", rider:"Hira Baig",   driver:"Asad Malik",  from:"E-11",        to:"F-10 Markaz", fare:290, status:"Accepted",        elapsedTime:"2 min",  surgeApplied:false, surgeMultiplier:1.0 },
];

export const MOCK_FLAGGED_DRIVERS = [
  { id:"D045", name:"Zain ul Abideen", rating:3.1, trips:89, issue:"Low Rating",    accountStatus:"Flagged" },
  { id:"D032", name:"Farhan Sheikh",   rating:3.4, trips:54, issue:"Complaints x3", accountStatus:"Flagged" },
];

export const MOCK_PLATFORM_STATS = {
  totalRevenue:2847600, activeRides:38, registeredDrivers:1240,
  registeredRiders:8904, todayRevenue:182400, totalTripsAllTime:94210,
};

export const MOCK_RIDE_HISTORY = [
  { id:"RD-8801", from:"F-10",      to:"G-9",       fare:280, date:"Today, 9:14 AM",    status:"Completed", driver:"Rizwan Khan", driverRating:5    },
  { id:"RD-8795", from:"E-7",       to:"Centaurus",  fare:450, date:"Yesterday, 6:30 PM",status:"Completed", driver:"Nadir Shah",  driverRating:4    },
  { id:"RD-8781", from:"Bahria Ph.1",to:"PWD",       fare:620, date:"Apr 17, 3:10 PM",  status:"Cancelled", driver:"N/A",         driverRating:null },
  { id:"RD-8760", from:"G-11",      to:"F-7 Markaz", fare:310, date:"Apr 14, 11:00 AM", status:"Completed", driver:"Kamil Hassan", driverRating:5   },
];

export const MOCK_EARNINGS_CHART = [
  { day:"Mon", amount:820  },
  { day:"Tue", amount:1240 },
  { day:"Wed", amount:960  },
  { day:"Thu", amount:1580 },
  { day:"Fri", amount:2100 },
  { day:"Sat", amount:1820 },
  { day:"Sun", amount:680  },
];

export const MOCK_INCOMING_RIDE = {
  id:"RD-8823", rider:"Fatima Zahra", riderRating:4.7,
  from:"D-12 Markaz", to:"F-6/2",
  distanceKm:7.2, fare:480, driverEta:"3 min away",
  surgeApplied:false,
};

export const MOCK_PROMO_CODES = [
  { code:"CUBINY50", discount:"50% off",     expiry:"Apr 30", isUsed:false },
  { code:"NEWRIDE",  discount:"Rs. 100 off", expiry:"May 15", isUsed:true  },
  { code:"ISLOO20",  discount:"20% off",     expiry:"May 31", isUsed:false },
];

export const MOCK_COMPLAINTS = [
  { id:"TK-001", subject:"Driver was rude",    date:"Apr 18", status:"Open"     },
  { id:"TK-002", subject:"Wrong route taken",  date:"Apr 15", status:"Resolved" },
];

export const MOCK_REVENUE_BY_METHOD = [
  { method:"Cash",   pct:42, color:"#2563EB"  },
  { method:"Wallet", pct:35, color:"#8B5CF6"    },
  { method:"Card",   pct:23, color:"#F59E0B"   },
];

export const MOCK_RATINGS = [
  { from:"Fatima Z.", score:5, comment:"Very punctual and professional!", date:"Apr 20" },
  { from:"Ali R.",    score:4, comment:"Good service, clean car.",         date:"Apr 18" },
  { from:"Sara K.",   score:5, comment:"Excellent experience!",            date:"Apr 17" },
  { from:"Bilal A.",  score:4, comment:null,                               date:"Apr 15" },
];

// ── BUG FIX: This was imported by mockService.js but was missing ──────────────
export const MOCK_WALLET_TRANSACTIONS = [
  { id:"TXN-001", type:"credit",  amount:500,  method:"JazzCash",  desc:"Wallet Top-Up",       date:"Today, 10:00 AM",     status:"Completed" },
  { id:"TXN-002", type:"debit",   amount:450,  method:"Wallet",    desc:"Ride RD-8795",        date:"Yesterday, 6:31 PM",  status:"Completed" },
  { id:"TXN-003", type:"credit",  amount:1000, method:"EasyPaisa", desc:"Wallet Top-Up",       date:"Apr 17, 2:45 PM",     status:"Completed" },
  { id:"TXN-004", type:"debit",   amount:280,  method:"Wallet",    desc:"Ride RD-8801",        date:"Apr 17, 9:15 AM",     status:"Completed" },
  { id:"TXN-005", type:"refund",  amount:620,  method:"Wallet",    desc:"Cancelled Ride Refund",date:"Apr 17, 3:30 PM",    status:"Refunded"  },
];
