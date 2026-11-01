const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const adminOnly = require("../middleware/auth");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post("/", adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  const stream = cloudinary.uploader.upload_stream(
    { folder: "strii" },
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ url: result.secure_url });
    }
  );
  stream.end(req.file.buffer);
});

module.exports = router;