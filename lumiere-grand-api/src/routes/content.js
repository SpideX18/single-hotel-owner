const express = require("express");
const { withDB, uuid } = require("../data/store");
const { requireAuth, requireRole } = require("../middleware/auth");
const { upload, fileUrl } = require("../middleware/upload");

// Small factory: builds a public-read / admin-write CRUD router for a
// simple collection (offers, experiences). Keeps these near-identical
// resources from turning into four copy-pasted files.
function simpleCollectionRouter(collectionName, defaults) {
  const router = express.Router();

  router.get("/", (_req, res) => {
    const db = withDB((d) => d);
    res.json(db[collectionName]);
  });

  router.post("/", requireAuth, requireRole("admin"), (req, res) => {
    const item = withDB((db) => {
      const entry = { id: uuid(), ...defaults, ...req.body };
      db[collectionName].push(entry);
      return entry;
    });
    res.status(201).json(item);
  });

  router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
    const updated = withDB((db) => {
      const idx = db[collectionName].findIndex((x) => x.id === req.params.id);
      if (idx === -1) return null;
      db[collectionName][idx] = { ...db[collectionName][idx], ...req.body, id: req.params.id };
      return db[collectionName][idx];
    });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  });

  router.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {
    const removed = withDB((db) => {
      const before = db[collectionName].length;
      db[collectionName] = db[collectionName].filter((x) => x.id !== req.params.id);
      return db[collectionName].length < before;
    });
    if (!removed) return res.status(404).json({ error: "Not found" });
    res.status(204).end();
  });

  router.post("/:id/image", requireAuth, requireRole("admin"), upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    res.status(201).json({ url: fileUrl(req, req.file.filename) });
  });

  return router;
}

const offers = simpleCollectionRouter("offers", { active: true, image: "" });
const experiences = simpleCollectionRouter("experiences", { image: "" });

// Reviews — customers submit, admin moderates/responds.
const reviews = express.Router();

reviews.get("/", (_req, res) => {
  const db = withDB((d) => d);
  res.json(db.reviews.filter((r) => r.status === "approved"));
});

reviews.get("/all", requireAuth, requireRole("admin"), (_req, res) => {
  const db = withDB((d) => d);
  res.json(db.reviews);
});

reviews.post("/", requireAuth, requireRole("customer"), (req, res) => {
  const body = req.body || {};
  const review = withDB((db) => {
    const r = {
      id: uuid(),
      guestId: req.user.id,
      guestName: req.user.name,
      roomTypeId: body.roomTypeId,
      rating: Number(body.rating) || 5,
      categories: body.categories || { rooms: 5, service: 5, cleanliness: 5, location: 5 },
      title: body.title || "",
      comment: body.comment || "",
      date: new Date().toISOString(),
      status: "pending",
      verified: true,
    };
    db.reviews.push(r);
    return r;
  });
  res.status(201).json(review);
});

reviews.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const updated = withDB((db) => {
    const idx = db.reviews.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return null;
    db.reviews[idx] = { ...db.reviews[idx], ...req.body, id: req.params.id };
    return db.reviews[idx];
  });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

// Notifications
const notifications = express.Router();

notifications.get("/", requireAuth, (req, res) => {
  const db = withDB((d) => d);
  const audience = req.user.role === "admin" ? "admin" : "customer";
  res.json(db.notifications.filter((n) => n.audience === audience));
});

notifications.put("/:id/read", requireAuth, (req, res) => {
  const updated = withDB((db) => {
    const idx = db.notifications.findIndex((n) => n.id === req.params.id);
    if (idx === -1) return null;
    db.notifications[idx].read = true;
    return db.notifications[idx];
  });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

module.exports = { offers, experiences, reviews, notifications };
