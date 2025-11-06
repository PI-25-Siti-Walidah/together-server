const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { uploadPrivateFile } = require("../middleware/upload.middleware");
const {
  createBuktiPenerimaan,
  getAllBuktiPenerimaan,
  getBuktiPenerimaanById,
  updateBuktiPenerimaan,
  verifyBuktiPenerimaan,
  deleteBuktiPenerimaan,
} = require("../controllers/bukti-penerimaan.controller");

router.post(
  "/",
  verifyToken,
  uploadPrivateFile("bukti-penerimaan").single("foto"),
  createBuktiPenerimaan
);
router.get("/", getAllBuktiPenerimaan);
router.get("/:id", getBuktiPenerimaanById);
router.patch(
  "/:id",
  verifyToken,
  uploadPrivateFile("bukti-penerimaan").single("foto"),
  updateBuktiPenerimaan
);
router.patch("/:id/verify", verifyToken, verifyBuktiPenerimaan);
router.delete("/:id", verifyToken, deleteBuktiPenerimaan);

module.exports = router;
