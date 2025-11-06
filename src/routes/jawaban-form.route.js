const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const { uploadPrivateFile } = require("../middleware/upload.middleware");
const {
  createJawabanForm,
  getAllJawabanForm,
  getJawabanFormById,
  updateJawabanForm,
  deleteJawabanForm,
} = require("../controllers/jawaban-form.controller");

router.post(
  "/",
  verifyToken,
  uploadPrivateFile("jawaban-form").single("jawaban"),
  createJawabanForm
);
router.get("/", getAllJawabanForm);
router.get("/:id", getJawabanFormById);
router.patch(
  "/:id",
  verifyToken,
  uploadPrivateFile("jawaban-form").single("jawaban"),
  updateJawabanForm
);
router.delete("/:id", verifyToken, deleteJawabanForm);

module.exports = router;
