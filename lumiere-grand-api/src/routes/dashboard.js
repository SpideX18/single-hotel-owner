const express = require("express");
const { withDB } = require("../data/store");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", requireAuth, requireRole("admin"), (_req, res) => {
  const db = withDB((d) => d);
  const today = new Date().toISOString().slice(0, 10);

  const activeBookings = db.bookings.filter((b) => b.status !== "cancelled");
  const revenue = activeBookings.reduce((sum, b) => sum + (b.payment?.status === "paid" ? b.total : 0), 0);
  const occupiedRooms = db.rooms.filter((r) => r.status === "occupied").length;
  const arrivalsToday = db.bookings.filter((b) => b.checkIn === today && b.status !== "cancelled").length;
  const departuresToday = db.bookings.filter((b) => b.checkOut === today && b.status !== "cancelled").length;
  const pendingReviews = db.reviews.filter((r) => r.status === "pending").length;

  res.json({
    totalRooms: db.rooms.length,
    occupiedRooms,
    occupancyRate: db.rooms.length ? Math.round((occupiedRooms / db.rooms.length) * 100) : 0,
    totalBookings: db.bookings.length,
    activeBookings: activeBookings.length,
    revenue: Math.round(revenue * 100) / 100,
    arrivalsToday,
    departuresToday,
    totalGuests: db.users.filter((u) => u.role === "customer").length,
    pendingReviews,
    roomTypeCount: db.roomTypes.length,
  });
});

module.exports = router;
