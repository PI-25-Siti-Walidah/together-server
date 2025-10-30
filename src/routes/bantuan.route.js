const express = require("express");
const router = express.Router();
const { uploadPublicImage } = require("../middleware/upload.middleware");
const {
  createBantuan,
  getAllBantuan,
  getBantuanById,
  updateBantuan,
  deleteBantuan,
  deleteAllBantuan,
} = require("../controllers/bantuan.controller");

router.post("/", uploadPublicImage("bantuan").single("foto"), createBantuan);
router.get("/", getAllBantuan);
router.get("/:id", getBantuanById);
router.put("/:id", uploadPublicImage("bantuan").single("foto"), updateBantuan);
router.delete("/:id", deleteBantuan);
router.delete("/", deleteAllBantuan);

module.exports = router;
