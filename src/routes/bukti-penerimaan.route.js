const express = require("express");
const router = express.Router();
const { uploadPrivateImage } = require("../middleware/upload.middleware");
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
  uploadPrivateImage("bukti-penerimaan").single("foto"),
  createBuktiPenerimaan
);
router.get("/", getAllBuktiPenerimaan);
router.get("/:id", getBuktiPenerimaanById);
router.patch(
  "/:id",
  uploadPrivateImage("bukti-penerimaan").single("foto"),
  updateBuktiPenerimaan
);
router.patch("/:id/verify", verifyBuktiPenerimaan);
router.delete("/:id", deleteBuktiPenerimaan);

module.exports = router;
