const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  createTrackingPengajuan,
  getAllTrackingPengajuan,
  getTrackingPengajuanById,
  updateTrackingPengajuan,
  deleteTrackingPengajuan,
} = require("../controllers/tracking-pengajuan.controller");

router.post("/", verifyToken, createTrackingPengajuan);
router.get("/", getAllTrackingPengajuan);
router.get("/:id", getTrackingPengajuanById);
router.patch("/:id", verifyToken, updateTrackingPengajuan);
router.delete("/:id", verifyToken, deleteTrackingPengajuan);

module.exports = router;
