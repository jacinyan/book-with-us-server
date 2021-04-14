const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

router.post("/upload", protect, admin, upload.single("image"), (req, res) => {
  res.send(`http://localhost:3000/${req.file.path}`);
});

module.exports = router;
