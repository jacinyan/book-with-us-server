const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        /* 
        Query.prototype.select()  
        include a and b, exclude other fields  
        query.select('a b');

        exclude c and d, include other fields  
        query.select('-c -d'); 
        */
        // set req, and pass over to getUserProfile
        req.user = await User.findById(decoded.id).select("-password");

        next();
      } catch (error) {
        console.error(error)
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
