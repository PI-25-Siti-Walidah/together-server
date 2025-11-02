const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  createMitra,
  getAllMitra,
  getMitraById,
  updateMitra,
  deleteMitra,
  deleteAllMitra,
} = require("../controllers/mitra.controller");
const { uploadPublicFile } = require("../middleware/upload.middleware");

router.post(
  "/",
  verifyToken,
  uploadPublicFile("mitra").single("logo"),
  createMitra
);
router.get("/", getAllMitra);
router.get("/:id", getMitraById);
router.patch(
  "/:id",
  verifyToken,
  uploadPublicFile("mitra").single("logo"),
  updateMitra
);
router.delete("/:id", verifyToken, deleteMitra);
router.delete("/", verifyToken, deleteAllMitra);

module.exports = router;
