const express = require("express");
const router = express.Router();
const {
  createPengajuan,
  getAllPengajuan,
  getAllPengajuanByUser,
  getPengajuanById,
  updatePengajuan,
  updateStatusPengajuan,
  deletePengajuan,
} = require("../controllers/pengajuan.controller");

router.post("/", createPengajuan);
router.get("/", getAllPengajuan);
router.get("/user", getAllPengajuanByUser);
router.get("/:id", getPengajuanById);
router.patch("/:id", updatePengajuan);
router.patch("/:id/status", updateStatusPengajuan);
router.delete("/:id", deletePengajuan);

module.exports = router;
