const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");

router.route("/users").post(registerUser).get(protect, admin, getUsers);
router.post("/users/login", authUser);
router
  .route("/users/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/users/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

module.exports = router;
