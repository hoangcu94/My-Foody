const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// @desc register new user
// @route POST /api/auth/register
// @access private
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(404).json({
      success: false,
      message: "Please enter username or email or password",
    });
  }

  try {
    // Check user exits
    const usernameExists = await User.findOne({ username: username });
    const emailExists = await User.findOne({ email: email });
    if (usernameExists || emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "username or email already exists" });
    }

    // Hash password
    const hashPassword = await argon2.hash(password);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    const user = await newUser.save();
    return res
      .status(201)
      .json({ success: true, message: "user saved successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc authenticated  user
// @route POST /api/auth/loginUser
// @access private
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email or password is invalid" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email and/or password is incorrect",
      });
    }
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(404).json({
        success: false,
        message: "Email and/or password is incorrect",
      });
    }

    // All goods, return token
    if (user && validPassword) {
      const accessToken = generateAccessToken(user);
      const { password, ...other } = user._doc;
      return res.status(200).json({ success: true, user: other, accessToken });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc get me
// @route get /api/auth/me
// @access private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: " User not found." });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Generate a token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, admin: user.admin },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "30d" }
  );
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
