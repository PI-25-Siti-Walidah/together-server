const express = require("express");
const router = express.Router();
const {
  createMitra,
  getAllMitra,
  getMitraById,
  updateMitra,
  deleteMitra,
  deleteAllMitra,
} = require("../controllers/mitra.controller");
const { uploadPublicImage } = require("../middleware/upload.middleware");

router.post("/", uploadPublicImage("mitra").single("logo"), createMitra);
router.get("/", getAllMitra);
router.get("/:id", getMitraById);
router.put("/:id", uploadPublicImage("mitra").single("logo"), updateMitra);
router.delete("/:id", deleteMitra);
router.delete("/", deleteAllMitra);

module.exports = router;
