const Item = require("../models/itemModel");

// @desc     Fetch all items
// @route    GET /api/items
// @access   Public
const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch single item
// @route    GET /api/item/:id
// @access   Public
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
};
