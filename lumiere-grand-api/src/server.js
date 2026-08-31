require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const hotelRoutes = require("./routes/hotel");
const roomTypeRoutes = require("./routes/roomTypes");
const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
const dashboardRoutes = require("./routes/dashboard");
const { offers, experiences, reviews, notifications } = require("./routes/content");

const app = express();

// CORS_ORIGIN should be your deployed frontend URL in production
// (comma-separated for multiple). Defaults to "*" for local development.
const allowedOrigins = (process.env.CORS_ORIGIN || "*").split(",").map((s) => s.trim());
app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  })
);
app.use(express.json({ limit: "2mb" }));

// Uploaded images are served from here — the URL returned by the upload
// endpoints already points at this path, so the frontend never has to
// guess or hardcode a host.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/hotel", hotelRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/offers", offers);
app.use("/api/experiences", experiences);
app.use("/api/reviews", reviews);
app.use("/api/notifications", notifications);
app.use("/api/dashboard", dashboardRoutes);

// Centralized error handler — catches multer errors (bad file type, too
// large) and anything else so the API never returns a raw stack trace.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Lumière Grand API listening on port ${PORT}`);
});
