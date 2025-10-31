const express = require("express");
const router = express.Router();
const {
  createJawabanForm,
  getAllJawabanForm,
  getJawabanFormById,
  updateJawabanForm,
  deleteJawabanForm,
} = require("../controllers/jawaban-form.controller");

router.post("/", createJawabanForm);
router.get("/", getAllJawabanForm);
router.get("/:id", getJawabanFormById);
router.patch("/:id", updateJawabanForm);
router.delete("/:id", deleteJawabanForm);

module.exports = router;
