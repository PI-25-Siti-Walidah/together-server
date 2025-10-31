const express = require("express");
const router = express.Router();
const {
  createFormPengajuan,
  getAllFormPengajuan,
  getFormPengajuanById,
  updateFormPengajuan,
  deleteFormPengajuan,
} = require("../controllers/form-pengajuan.controller");

router.post("/", createFormPengajuan);
router.get("/", getAllFormPengajuan);
router.get("/:id", getFormPengajuanById);
router.patch("/:id", updateFormPengajuan);
router.delete("/:id", deleteFormPengajuan);

module.exports = router;
