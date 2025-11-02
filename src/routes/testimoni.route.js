const express = require("express");
const router = express.Router();
const { uploadPublicFile } = require("../middleware/upload.middleware");
const {
  createTestimoni,
  getAllTestimoni,
  getTestimoniById,
  updateTestimoni,
  deleteTestimoni,
} = require("../controllers/testimoni.controller");

router.post("/", uploadPublicFile("testimoni").single("foto"), createTestimoni);
router.get("/", getAllTestimoni);
router.get("/:id", getTestimoniById);
router.patch(
  "/:id",
  uploadPublicFile("testimoni").single("foto"),
  updateTestimoni
);
router.delete("/:id", deleteTestimoni);

module.exports = router;
