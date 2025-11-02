const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updatePassword,
  deleteUser,
} = require("../controllers/user.controller");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/profile", updateProfile);
router.patch("/:id/password", updatePassword);
router.delete("/:id", deleteUser);

module.exports = router;
