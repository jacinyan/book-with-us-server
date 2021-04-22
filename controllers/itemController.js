const Item = require("../models/itemModel");
const Order = require("../models/orderModel");

// @desc     Fetch all items
// @route    GET /api/items
// @access   Public
const getItems = async (req, res, next) => {
  try {
    const pageSize = 8;
    //?page=2
    const page = Number(req.query.page) || 1;

    const search = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        }
      : {};
    //total count of items
    const count = await Item.countDocuments({ ...search });

    const items = await Item.find({ ...search })
      // ensures each page has a number, which equals the pageSize, of items
      .limit(pageSize)
      // ensures each page has the correct starting item
      .skip(pageSize * (page - 1));

    res.json({ items, page, pages: Math.ceil(count / pageSize) });
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

// @desc     Delete a single item
// @route    DELETE /api/items/:id
// @access   Private/Admin
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      await item.remove();
      res.json({ message: "Item removed" });
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Create a single item
// @route    Post /api/items
// @access   Private/Admin
const createItem = async (req, res, next) => {
  try {
    const item = new Item({
      name: "Sample name",
      price: 0,
      user: req.user._id,
      image: "https://dummyimage.com/200X300/d3d3d3/ffffff",
      genre: "Sample genre",
      author: "Sample author",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    next(error);
  }
};

// @desc     Update a single item
// @route    Put /api/items/:id
// @access   Private/Admin
const updateItem = async (req, res, next) => {
  try {
    const {
      name,
      price,
      genre,
      description,
      image,
      author,
      countInStock,
    } = req.body;

    const item = await Item.findById(req.params.id);

    if (item) {
      item.name = name;
      item.price = price;
      item.description = description;
      item.genre = genre;
      item.author = author;
      item.image = image;
      item.countInStock = countInStock;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Create a new review
// @route    POST /api/items/:id/reviews
// @access   Private
const createItemReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const item = await Item.findById(req.params.id);

    // bring in all user orders first for a following check-up
    const orders = await Order.find({ user: req.user._id });

    // an array of ids of all the items the user ordered so far
    const orderedItemsId = [].concat.apply(
      [],
      orders.map((order) =>
        order.orderItems.map((item) => item.item.toString())
      )
    );

    console.log(orderedItemsId);

    if (item) {
      // check if the id of the item matches at least one of the users ordered items
      const hasOrdered = orderedItemsId.includes(item._id.toString());

      if (!hasOrdered) {
        res.status(400);
        throw new Error("You can only review your ordered items");
      }

      const alreadyReviewed = item.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );
      // one review per customer only
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("You've already reviewed the item");
      }
      const review = {
        username: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      item.reviews.push(review);
      item.numReviews = item.reviews.length;
      item.rating =
        item.reviews.reduce((prev, curr) => curr.rating + prev, 0) /
        item.reviews.length;

      await item.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Get top rated books
// @route    GET /api/items/top
// @access   Public
const getTopItems = async (req, res, next) => {
  try {
    //sort by rating
    const items = await Item.find({}).sort({ rating: -1 }).limit(3);
    res.json(items)
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  deleteItem,
  createItem,
  updateItem,
  createItemReview,
  getTopItems
};
