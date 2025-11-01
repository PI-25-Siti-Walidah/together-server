const express = require("express");
const router = express.Router();
const { uploadPrivateImage } = require("../middleware/upload.middleware");
const {
  createTestimoni,
  getAllTestimoni,
  getTestimoniById,
  updateTestimoni,
  deleteTestimoni,
} = require("../controllers/testimoni.controller");

router.post(
  "/",
  uploadPrivateImage("testimoni").single("foto"),
  createTestimoni
);
router.get("/", getAllTestimoni);
router.get("/:id", getTestimoniById);
router.patch(
  "/:id",
  uploadPrivateImage("testimoni").single("foto"),
  updateTestimoni
);
router.delete("/:id", deleteTestimoni);

module.exports = router;
