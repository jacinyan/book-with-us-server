const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
// const { upload } = require("../middleware/uploadMiddleware");
const { uploadToS3 } = require("../middleware/uploadMiddleware");

router.post("/upload", protect, admin, uploadToS3);

module.exports = router;
