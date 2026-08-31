const express = require("express");
const { withDB, uuid } = require("../data/store");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), (_req, res) => {
  const db = withDB((d) => d);
  res.json(db.rooms);
});

router.post("/", requireAuth, requireRole("admin"), (req, res) => {
  const body = req.body || {};
  if (!body.number || !body.roomTypeId) {
    return res.status(400).json({ error: "number and roomTypeId are required" });
  }
  const room = withDB((db) => {
    const r = {
      id: uuid(),
      number: body.number,
      floor: Number(body.floor) || 1,
      roomTypeId: body.roomTypeId,
      status: body.status || "available",
      notes: body.notes || "",
    };
    db.rooms.push(r);
    return r;
  });
  res.status(201).json(room);
});

router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const updated = withDB((db) => {
    const idx = db.rooms.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return null;
    db.rooms[idx] = { ...db.rooms[idx], ...req.body, id: db.rooms[idx].id };
    return db.rooms[idx];
  });
  if (!updated) return res.status(404).json({ error: "Room not found" });
  res.json(updated);
});

router.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const removed = withDB((db) => {
    const before = db.rooms.length;
    db.rooms = db.rooms.filter((r) => r.id !== req.params.id);
    return db.rooms.length < before;
  });
  if (!removed) return res.status(404).json({ error: "Room not found" });
  res.status(204).end();
});

module.exports = router;
