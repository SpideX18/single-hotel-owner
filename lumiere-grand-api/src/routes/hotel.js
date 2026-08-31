const express = require("express");
const { withDB } = require("../data/store");
const { requireAuth, requireRole } = require("../middleware/auth");
const { upload, fileUrl } = require("../middleware/upload");

const router = express.Router();

// Public — every visitor needs this to render the site.
router.get("/", (_req, res) => {
  const db = withDB((d) => d);
  res.json(db.hotelSettings);
});

// Admin — edit hotel identity/content.
router.put("/", requireAuth, requireRole("admin"), (req, res) => {
  const updated = withDB((db) => {
    db.hotelSettings = { ...db.hotelSettings, ...req.body };
    return db.hotelSettings;
  });
  res.json(updated);
});

// Admin — upload the hero image / gallery images for the hotel itself.
router.post(
  "/images",
  requireAuth,
  requireRole("admin"),
  upload.array("images", 12),
  (req, res) => {
    const urls = (req.files || []).map((f) => fileUrl(req, f.filename));
    res.status(201).json({ urls });
  }
);

module.exports = router;
