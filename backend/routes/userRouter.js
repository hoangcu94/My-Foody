const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getMe,
} = require("../controllers/userControllers");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

router.get("/me", verifyToken, getMe);
router.get("/all-user", verifyToken, getAllUsers);
router.put("/:id", verifyTokenAndAdmin, updateUser);
router.delete("/:id", verifyTokenAndAdmin, deleteUser);

module.exports = router;
