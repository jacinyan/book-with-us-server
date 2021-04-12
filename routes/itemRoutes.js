const express = require("express");
const router = express.Router();
const {
  getItems,
  getItemById,
  deleteItem,
  updateItem,
  createItem,
} = require("../controllers/itemController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/items").get(getItems).post(protect, admin, createItem);
router
  .route("/items/:id")
  .get(getItemById)
  .delete(protect, admin, deleteItem)
  .put(protect, admin, updateItem);

module.exports = router;
