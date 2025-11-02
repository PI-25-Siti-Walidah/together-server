const Kategori = require("../models/kategori.model");

module.exports = {
  createKategori: async (req, res) => {
    try {
      const { nama_kategori } = req.body;

      if (!nama_kategori) {
        return res.status(400).json({ message: "Nama kategori wajib diisi" });
      }

      const existing = await Kategori.findOne({ nama_kategori });
      if (existing) {
        return res.status(400).json({ message: "Kategori sudah ada" });
      }

      const kategori = new Kategori({ nama_kategori });
      await kategori.save();

      res.status(201).json({
        message: "Kategori berhasil dibuat",
        kategori,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal membuat kategori",
        error: error.message,
      });
    }
  },

  getAllKategori: async (req, res) => {
    try {
      const kategori = await Kategori.find().sort({ createdAt: -1 });
      res.status(200).json({
        message: "Berhasil mengambil semua kategori",
        kategori,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data kategori",
        error: error.message,
      });
    }
  },

  getKategoriById: async (req, res) => {
    try {
      const kategori = await Kategori.findById(req.params.id);
      if (!kategori) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }
      res.status(200).json({
        message: "Berhasil mengambil data kategori",
        kategori,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data kategori",
        error: error.message,
      });
    }
  },

  updateKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama_kategori } = req.body;

      if (!nama_kategori) {
        return res.status(400).json({ message: "Nama kategori wajib diisi" });
      }

      const updated = await Kategori.findByIdAndUpdate(
        id,
        { nama_kategori },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil memperbarui kategori",
        kategori: updated,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal memperbarui kategori",
        error: error.message,
      });
    }
  },

  deleteKategori: async (req, res) => {
    try {
      const deleted = await Kategori.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil menghapus kategori",
        kategori: deleted,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menghapus kategori",
        error: error.message,
      });
    }
  },

  deleteAllKategori: async (req, res) => {
    try {
      const deleted = await Kategori.deleteMany({});
      res.status(200).json({
        message: "Berhasil menghapus semua kategori",
        deletedCount: deleted.deletedCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menghapus semua kategori",
        error: error.message,
      });
    }
  },
};
