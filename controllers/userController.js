const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");

// @desc     Auth users & get token
// @route    POST /api/users/login
// @access   Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // check boolean of password comparison
    if (user && (await user.matchPassword(password))) {
      res.json({
        // _id: user._id,
        username: user.username,
        // email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Register a new user
// @route    POST /api/users/register
// @access   Public
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // if password length < 6
    if (password && password.length < 6) {
      res.status(400);
      throw new Error("Password is 6 characters minimum");
    }

    // if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    try {
      // catch errors from User schema
      const user = await User.create({
        username,
        email,
        password,
      });
      if (user) {
        res.status(201).json({
          // _id: user._id,
          username: user.username,
          // email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      }
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Get user profile
// @route    Get /api/users/profile
// @access   Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     update user profile
// @route    PUT /api/users/profile
// @access   Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Get all users
// @route    Get /api/users
// @access   Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users) {
      res.json(users);
    } else {
      res.status(404);
      throw new Error("Users not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Delete a users
// @route    Delete /api/users/:id
// @access   Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     get user by Id
// @route    Get /api/users/:id
// @access   Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Update user
// @route    PUT /api/users/:id
// @access   Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      // a ?? b  --->  a !== undefined && a !== null ? a : b
      // N.B.: false ?? default ---> false, because false is neither undefined nor null
      user.isAdmin = req.body.isAdmin ?? user.isAdmin;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
