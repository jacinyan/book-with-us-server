const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} = require("../controllers/orderController");

router
  .route("/orders")
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);
router.route("/orders/my-orders").get(protect, getMyOrders);
// matching sequence matters
router.route("/orders/:id").get(protect, getOrderById);
router.route("/orders/:id/pay").put(protect, updateOrderToPaid);
router.route("/orders/:id/deliver").put(protect, admin, updateOrderToDelivered);

module.exports = router;
