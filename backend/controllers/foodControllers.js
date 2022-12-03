const Food = require("../models/foodModel");
const User = require("../models/userModel");

// @desc Get all foods
// @route GET /api/foods
//@access private

const getAllFoods = async (req, res) => {
  const foods = await Food.find();
  return res.status(200).json(foods);
};

// @desc Get food
// @route GET /api/foods/:id
//@access private

const getFood = async (req, res) => {
  // Check food with userId
  const food = await Food.find({
    userId: req.params.userId,
    _id: req.params.id,
  });
  return res.status(200).json({ food });
};

// @desc Get user foods
// @route GET /api/foods/:userId
//@access private

const getUserFoods = async (req, res) => {
  const foods = await Food.find({ userId: req.params.userId });
  return res.status(200).json(foods);
};

// @desc Set foods
// @route POST /api/foods
//@access private
const setFood = async (req, res) => {
  if (!req.body.text) {
    return res
      .status(400)
      .json({ success: false, message: "Please add a text field" });
  }

  const food = await Food.create({
    text: req.body.text,
    userId: req.user.id,
  });
  return res
    .status(200)
    .json({ success: true, message: "Create food successfully", food });
};

// @desc Update foods
// @route PUT /api/foods/:id
//@access private
const updateFood = async (req, res) => {
  const food = await Food.findById({ _id: req.params.id });
  if (!food) {
    return res.status(400).json({ success: false, message: "Food not found" });
  }
  // Check user authentication
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }
  // Check authorization
  if (user.isAdmin || user.id === food.userId.toString()) {
    const updateFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "Update food successfully", updateFood });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized" });
  }
};

// @desc Delete foods
// @route DELETE /api/foods/:id
// @access private
const deleteFood = async (req, res) => {
  const food = await Food.findById({ _id: req.params.id });
  if (!food) {
    return res.status(400).json({ success: false, message: "Food not found" });
  }
  // Check user authentication
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }
  // Check authorization or admin
  if (user.isAdmin || user.id === food.userId.toString()) {
    const deleteFood = await Food.findByIdAndDelete({ _id: req.params.id });
    return res
      .status(200)
      .json({ success: true, message: "Delete food successfully", deleteFood });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized" });
  }
};

module.exports = {
  getAllFoods,
  getFood,
  setFood,
  updateFood,
  deleteFood,
  getUserFoods,
};
