const express = require("express");
const { withDB, uuid } = require("../data/store");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function reference() {
  return "LG-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// Customer — create a booking for a room type.
router.post("/", requireAuth, requireRole("customer"), (req, res) => {
  const body = req.body || {};
  const { roomTypeId, checkIn, checkOut, guests, rooms, addons, specialRequests, payment } = body;
  if (!roomTypeId || !checkIn || !checkOut) {
    return res.status(400).json({ error: "roomTypeId, checkIn and checkOut are required" });
  }

  const result = withDB((db) => {
    const roomType = db.roomTypes.find((r) => r.id === roomTypeId);
    if (!roomType) return { error: "Room type not found" };

    const nights = nightsBetween(checkIn, checkOut);
    const roomCount = Math.max(1, Number(rooms) || 1);
    const addonList = Array.isArray(addons) ? addons : [];
    const addonsTotal = addonList.reduce((sum, a) => {
      const qty = Number(a.quantity) || 1;
      const unitMultiplier = a.unit === "night" ? nights : a.unit === "guest" ? Number(guests) || 1 : 1;
      return sum + Number(a.price) * qty * unitMultiplier;
    }, 0);

    const subtotal = roomType.basePrice * nights * roomCount + addonsTotal;
    const taxPercent = db.hotelSettings.taxPercent ?? 12;
    const tax = Math.round(subtotal * (taxPercent / 100) * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const booking = {
      id: uuid(),
      reference: reference(),
      guestId: req.user.id,
      roomId: null,
      roomTypeId,
      checkIn,
      checkOut,
      guests: Number(guests) || 1,
      rooms: roomCount,
      addons: addonList,
      subtotal: Math.round(subtotal * 100) / 100,
      tax,
      discount: 0,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      source: "Direct Website",
      specialRequests: specialRequests || "",
      payment: payment
        ? { id: uuid(), status: "pending", amount: total, paidAt: "", ...payment }
        : { id: uuid(), method: "Visa", last4: "0000", amount: total, status: "pending", paidAt: "" },
    };
    db.bookings.push(booking);
    db.notifications.push({
      id: uuid(),
      audience: "admin",
      type: "booking",
      title: "New booking received",
      body: `${req.user.name} booked ${roomType.name} (${nights} night${nights > 1 ? "s" : ""})`,
      time: new Date().toISOString(),
      read: false,
    });
    return { booking };
  });

  if (result.error) return res.status(404).json({ error: result.error });
  res.status(201).json(result.booking);
});

// Customer — own bookings.
router.get("/mine", requireAuth, (req, res) => {
  const db = withDB((d) => d);
  const mine = db.bookings.filter((b) => b.guestId === req.user.id);
  res.json(mine);
});

// Admin — all bookings.
router.get("/", requireAuth, requireRole("admin"), (_req, res) => {
  const db = withDB((d) => d);
  res.json(db.bookings);
});

// Admin — update status (confirm, check-in, check-out, cancel).
router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const updated = withDB((db) => {
    const idx = db.bookings.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return null;
    db.bookings[idx] = { ...db.bookings[idx], ...req.body, id: db.bookings[idx].id };
    return db.bookings[idx];
  });
  if (!updated) return res.status(404).json({ error: "Booking not found" });
  res.json(updated);
});

// Customer — cancel own booking.
router.post("/:id/cancel", requireAuth, (req, res) => {
  const updated = withDB((db) => {
    const idx = db.bookings.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return null;
    if (db.bookings[idx].guestId !== req.user.id && req.user.role !== "admin") return "forbidden";
    db.bookings[idx].status = "cancelled";
    return db.bookings[idx];
  });
  if (updated === "forbidden") return res.status(403).json({ error: "Not allowed" });
  if (!updated) return res.status(404).json({ error: "Booking not found" });
  res.json(updated);
});

module.exports = router;
