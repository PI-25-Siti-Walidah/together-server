const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { uploadPublicFile } = require("../middleware/upload.middleware");
const {
  createTestimoni,
  getAllTestimoni,
  getTestimoniById,
  updateTestimoni,
  deleteTestimoni,
} = require("../controllers/testimoni.controller");

router.post(
  "/",
  verifyToken,
  uploadPublicFile("testimoni").single("foto"),
  createTestimoni
);
router.get("/", getAllTestimoni);
router.get("/:id", getTestimoniById);
router.patch(
  "/:id",
  verifyToken,
  uploadPublicFile("testimoni").single("foto"),
  updateTestimoni
);
router.delete("/:id", verifyToken, deleteTestimoni);

module.exports = router;
