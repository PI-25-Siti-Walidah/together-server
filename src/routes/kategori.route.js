const express = require("express");
const router = express.Router();
const {
  createKategori,
  getAllKategori,
  getKategoriById,
  updateKategori,
  deleteKategori,
  deleteAllKategori,
} = require("../controllers/kategori.controller");

router.post("/", createKategori);
router.get("/", getAllKategori);
router.get("/:id", getKategoriById);
router.put("/:id", updateKategori);
router.delete("/:id", deleteKategori);
router.delete("/", deleteAllKategori);

module.exports = router;
