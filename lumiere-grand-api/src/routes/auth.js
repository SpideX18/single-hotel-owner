const express = require("express");
const bcrypt = require("bcryptjs");
const { withDB, uuid } = require("../data/store");
const { sign, requireAuth } = require("../middleware/auth");

const router = express.Router();

// Public self-registration always creates a "customer" — admin accounts
// are never created through this endpoint (there is exactly one hotel
// admin, seeded in the DB; see README to change its password/email).
router.post("/register", (req, res) => {
  const { email, password, name, phone } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: "name, email and password are required" });
  }
  const result = withDB((db) => {
    const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return { error: "An account with this email already exists" };
    const user = {
      id: uuid(),
      email,
      name,
      phone: phone || "",
      passwordHash: bcrypt.hashSync(password, 10),
      role: "customer",
      loyaltyTier: "Classic",
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    return { user };
  });
  if (result.error) return res.status(409).json({ error: result.error });
  const { passwordHash, ...safeUser } = result.user;
  res.status(201).json({ token: sign(result.user), user: safeUser });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const db = withDB((d) => d);
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user || !bcrypt.compareSync(password || "", user.passwordHash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ token: sign(user), user: safeUser });
});

router.get("/me", requireAuth, (req, res) => {
  const db = withDB((d) => d);
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

module.exports = router;
