const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { uploadPublicFile } = require("../middleware/upload.middleware");
const {
  createBantuan,
  getAllBantuan,
  getBantuanById,
  updateBantuan,
  deleteBantuan,
  deleteAllBantuan,
} = require("../controllers/bantuan.controller");

router.post(
  "/",
  verifyToken,
  uploadPublicFile("bantuan").single("foto"),
  createBantuan
);
router.get("/", getAllBantuan);
router.get("/:id", getBantuanById);
router.patch(
  "/:id",
  verifyToken,
  uploadPublicFile("bantuan").single("foto"),
  updateBantuan
);
router.delete("/:id", verifyToken, deleteBantuan);
router.delete("/", verifyToken, deleteAllBantuan);

module.exports = router;
