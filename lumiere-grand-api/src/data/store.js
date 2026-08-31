// Tiny file-backed JSON database. No native build steps, no external DB
// server to configure — good enough for a single-property hotel and easy
// to later swap for Postgres/Mongo without touching route code (every
// route only talks to the functions exported below).
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");

const DB_FILE = path.join(__dirname, "db.json");

function defaultData() {
  return {
    // The hotel's own identity/content — starts empty/placeholder.
    // The admin fills this in from the dashboard; nothing hotel-specific
    // is hardcoded here.
    hotelSettings: {
      name: "Your Hotel Name",
      tagline: "Add a tagline from the admin dashboard",
      description: "",
      address: "",
      phone: "",
      email: "",
      checkInTime: "15:00",
      checkOutTime: "11:00",
      currency: "USD",
      taxPercent: 12,
      heroImage: "",
      heroImages: [],
      amenities: [],
      policies: "",
    },
    users: [
      {
        id: uuid(),
        email: "admin@example.com",
        // default password: Admin@12345 (change immediately after first login)
        passwordHash: bcrypt.hashSync("Admin@12345", 10),
        name: "Hotel Admin",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ],
    roomTypes: [],
    rooms: [],
    bookings: [],
    offers: [],
    experiences: [],
    reviews: [],
    notifications: [],
  };
}

function load() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData(), null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Simple in-process lock-free read-modify-write. Fine for a single
// hotel's traffic; swap for a real DB if you outgrow this.
function withDB(fn) {
  const data = load();
  const result = fn(data);
  save(data);
  return result;
}

module.exports = { load, save, withDB, uuid };
