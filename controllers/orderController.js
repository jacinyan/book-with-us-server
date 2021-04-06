const Order = require("../models/orderModel");

// @desc     Create new order
// @route    POST /api/orders
// @access   Private
const addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      const order = new Order({
        user: req.user_id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrderItems,
};
