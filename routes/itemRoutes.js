const express = require("express");
const router = express.Router();
const {
  getItems,
  getItemById,
  deleteItem,
  updateItem,
  createItem,
  createItemReview,
  getTopItems,
} = require("../controllers/itemController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/items").get(getItems).post(protect, admin, createItem);
router.get("/items/top", getTopItems);
router
  .route("/items/:id")
  .get(getItemById)
  .delete(protect, admin, deleteItem)
  .put(protect, admin, updateItem);
router.route("/items/:id/reviews").post(protect, createItemReview);

module.exports = router;
