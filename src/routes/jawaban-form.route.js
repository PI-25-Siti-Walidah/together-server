const express = require("express");
const router = express.Router();
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
  uploadPrivateFile("jawaban-form").single("jawaban"),
  createJawabanForm
);
router.get("/", getAllJawabanForm);
router.get("/:id", getJawabanFormById);
router.patch(
  "/:id",
  uploadPrivateFile("jawaban-form").single("jawaban"),
  updateJawabanForm
);
router.delete("/:id", deleteJawabanForm);

module.exports = router;
