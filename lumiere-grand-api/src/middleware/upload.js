const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid()}${ext}`);
  },
});

const ALLOWED = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext)) return cb(new Error("Unsupported image type"));
    cb(null, true);
  },
});

// Builds an absolute URL for a stored file so the frontend can render it
// directly with no relative-path guessing — this is what avoids broken
// images once frontend and backend are deployed on different domains.
function fileUrl(req, filename) {
  const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/${filename}`;
}

module.exports = { upload, fileUrl, UPLOAD_DIR };
