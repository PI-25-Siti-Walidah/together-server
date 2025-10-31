const express = require("express");
const router = express.Router();
const {
  createTrackingPengajuan,
  getAllTrackingPengajuan,
  getTrackingPengajuanById,
  updateTrackingPengajuan,
  deleteTrackingPengajuan,
} = require("../controllers/tracking-pengajuan.controller");

router.post("/", createTrackingPengajuan);
router.get("/", getAllTrackingPengajuan);
router.get("/:id", getTrackingPengajuanById);
router.patch("/:id", updateTrackingPengajuan);
router.delete("/:id", deleteTrackingPengajuan);

module.exports = router;
