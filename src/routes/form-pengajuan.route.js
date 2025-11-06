const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  createFormPengajuan,
  getAllFormPengajuan,
  getFormPengajuanById,
  updateFormPengajuan,
  deleteFormPengajuan,
} = require("../controllers/form-pengajuan.controller");

router.post("/", verifyToken, createFormPengajuan);
router.get("/", getAllFormPengajuan);
router.get("/:id", getFormPengajuanById);
router.patch("/:id", verifyToken, updateFormPengajuan);
router.delete("/:id", verifyToken, deleteFormPengajuan);

module.exports = router;
