const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// CHeck user credentials
const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN,
      async (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Token is not valid." });
        }
        // req.user = user;
        req.user = await User.findById(user.id);
        next();
      }
    );
  } else {
    return res
      .status(401)
      .json({ success: false, message: "you are not authenticated" });
  }
};

// Check user is authenticated and admin
const verifyTokenAndAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not enough rights" });
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAdmin };
