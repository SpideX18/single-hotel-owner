const express = require("express");
const { withDB, uuid } = require("../data/store");
const { requireAuth, requireRole } = require("../middleware/auth");
const { upload, fileUrl } = require("../middleware/upload");

const router = express.Router();

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

router.get("/", (_req, res) => {
  const db = withDB((d) => d);
  res.json(db.roomTypes);
});

router.get("/:id", (req, res) => {
  const db = withDB((d) => d);
  const rt = db.roomTypes.find((r) => r.id === req.params.id || r.slug === req.params.id);
  if (!rt) return res.status(404).json({ error: "Room type not found" });
  res.json(rt);
});

router.post("/", requireAuth, requireRole("admin"), (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.basePrice) {
    return res.status(400).json({ error: "name and basePrice are required" });
  }
  const roomType = withDB((db) => {
    const rt = {
      id: uuid(),
      slug: slugify(body.name) + "-" + Math.random().toString(36).slice(2, 6),
      name: body.name,
      tagline: body.tagline || "",
      description: body.description || "",
      longDescription: body.longDescription || "",
      basePrice: Number(body.basePrice),
      sizeSqm: Number(body.sizeSqm) || 0,
      maxGuests: Number(body.maxGuests) || 2,
      bed: body.bed || "",
      view: body.view || "",
      amenities: Array.isArray(body.amenities) ? body.amenities : [],
      images: Array.isArray(body.images) ? body.images : [],
      rating: 0,
      reviewCount: 0,
      breakfastIncluded: !!body.breakfastIncluded,
      bathtub: !!body.bathtub,
      lounge: !!body.lounge,
      butler: !!body.butler,
      active: body.active !== false,
    };
    db.roomTypes.push(rt);
    return rt;
  });
  res.status(201).json(roomType);
});

router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const updated = withDB((db) => {
    const idx = db.roomTypes.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return null;
    db.roomTypes[idx] = { ...db.roomTypes[idx], ...req.body, id: db.roomTypes[idx].id };
    return db.roomTypes[idx];
  });
  if (!updated) return res.status(404).json({ error: "Room type not found" });
  res.json(updated);
});

router.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const removed = withDB((db) => {
    const before = db.roomTypes.length;
    db.roomTypes = db.roomTypes.filter((r) => r.id !== req.params.id);
    db.rooms = db.rooms.filter((r) => r.roomTypeId !== req.params.id);
    return db.roomTypes.length < before;
  });
  if (!removed) return res.status(404).json({ error: "Room type not found" });
  res.status(204).end();
});

// Admin — upload one or more images for a specific room type, returns
// absolute URLs to attach into roomType.images via PUT above.
router.post(
  "/:id/images",
  requireAuth,
  requireRole("admin"),
  upload.array("images", 10),
  (req, res) => {
    const urls = (req.files || []).map((f) => fileUrl(req, f.filename));
    res.status(201).json({ urls });
  }
);

module.exports = router;
