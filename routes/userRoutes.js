const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.post("/users/login", authUser);
router.post("/users", registerUser);
router
  .route("/users/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
