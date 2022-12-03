const express = require("express");
const router = express.Router();
const {
  getAllFoods,
  getFood,
  getUserFoods,
  setFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodControllers");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getAllFoods);
router.get("/:userId", verifyToken, getUserFoods);
router.get("/:userId/:id", verifyToken, getFood);
router.post("/", verifyToken, setFood);

router.put("/:id", verifyToken, updateFood);
router.delete("/:id", verifyToken, deleteFood);
module.exports = router;
