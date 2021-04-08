const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid
} = require("../controllers/orderController");

router.route('/orders').post(protect, addOrderItems);
// matching sequence matters
router.route('/orders/:id').get(protect, getOrderById)
router.route('/orders/:id/pay').put(protect, updateOrderToPaid)


module.exports = router;
