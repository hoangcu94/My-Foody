const User = require("../models/userModel");
const argon2 = require("argon2");

// @desc GET ALL Users
// @route GET /api/users/all-users
// @access private
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  return res
    .status(200)
    .json({ success: true, message: `Have ${users.length} users`, users });
};

// @desc Get me
// @route Get /api/users/me
// @access private
const getMe = async (req, res) => {
  const user = await User.find(req.user).select("-password");
  return res.status(200).json({ success: true, message: user });
};

// @desc Update user
// @route PUT /api/users/:id
// @access private
const updateUser = async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (req.body.password) {
    return res.status(400).json({ message: "Don't change your password" });
  }
  if (req.body.email) {
    return res.status(400).json({ message: "Don't change your email" });
  }
  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");
  return res
    .status(200)
    .json({ success: "update user success", message: updateUser });
};

// @desc Delete User
// @route Delete /api/users/:id
// @access private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (user) {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ success: true, message: "Delete user successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser, getMe };
