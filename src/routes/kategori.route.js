const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  createKategori,
  getAllKategori,
  getKategoriById,
  updateKategori,
  deleteKategori,
  deleteAllKategori,
} = require("../controllers/kategori.controller");

router.post("/", verifyToken, createKategori);
router.get("/", getAllKategori);
router.get("/:id", getKategoriById);
router.put("/:id", verifyToken, updateKategori);
router.delete("/:id", verifyToken, deleteKategori);
router.delete("/", verifyToken, deleteAllKategori);

module.exports = router;
