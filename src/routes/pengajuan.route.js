const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  createPengajuan,
  getAllPengajuan,
  getAllPengajuanByUser,
  getPengajuanById,
  updatePengajuan,
  updateStatusPengajuan,
  deletePengajuan,
} = require("../controllers/pengajuan.controller");

router.post("/", verifyToken, createPengajuan);
router.get("/", getAllPengajuan);
router.get("/user", getAllPengajuanByUser);
router.get("/:id", getPengajuanById);
router.patch("/:id", verifyToken, updatePengajuan);
router.patch("/:id/status", verifyToken, updateStatusPengajuan);
router.delete("/:id", verifyToken, deletePengajuan);

module.exports = router;
