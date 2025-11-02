const Pengajuan = require("../models/pengajuan.model");
const Bantuan = require("../models/bantuan.model");

module.exports = {
  createPengajuan: async (req, res) => {
    try {
      const { bantuan_id } = req.body;
      const user_id = req.user?._id;

      if (!user_id) {
        return res.status(401).json({ message: "User tidak terautentikasi" });
      }

      const existing = await Pengajuan.findOne({ user_id, bantuan_id });
      if (existing) {
        return res.status(400).json({
          message: "Anda sudah mengajukan bantuan ini sebelumnya",
        });
      }

      const bantuan = await Bantuan.findById(bantuan_id);
      if (!bantuan || !bantuan.is_active) {
        return res.status(400).json({ message: "Bantuan tidak tersedia" });
      }

      const pengajuan = await Pengajuan.create({
        user_id,
        bantuan_id,
      });

      res.status(201).json({
        message: "Pengajuan berhasil dibuat",
        pengajuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal membuat pengajuan",
        error: error.message,
      });
    }
  },

  getAllPengajuan: async (req, res) => {
    try {
      const pengajuan = await Pengajuan.find()
        .populate("bantuan_id", "judul bentuk_bantuan")
        .populate("user_id", "nama username no_telp")
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Berhasil mengambil semua pengajuan",
        pengajuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil semua pengajuan",
        error: error.message,
      });
    }
  },

  getAllPengajuanByUser: async (req, res) => {
    try {
      const user_id = req.user?._id;
      if (!user_id) {
        return res.status(401).json({ message: "User tidak terautentikasi" });
      }

      const pengajuan = await Pengajuan.find({ user_id }).populate(
        "bantuan_id",
        "judul bentuk_bantuan"
      );

      res.status(200).json({
        message: "Berhasil mengambil semua pengajuan user",
        pengajuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil semua pengajuan",
        error: error.message,
      });
    }
  },

  getPengajuanById: async (req, res) => {
    try {
      const pengajuan = await Pengajuan.findById(req.params.id)
        .populate("bantuan_id", "judul deskripsi bentuk_bantuan")
        .populate("user_id", "nama username no_telp alamat");

      if (!pengajuan) {
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil mengambil data pengajuan",
        pengajuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data pengajuan",
        error: error.message,
      });
    }
  },

  updatePengajuan: async (req, res) => {
    try {
      const { id } = req.params;
      const { status_pengajuan, catatan_admin } = req.body;

      const pengajuan = await Pengajuan.findByIdAndUpdate(
        id,
        { status_pengajuan, catatan_admin },
        { new: true }
      );

      if (!pengajuan) {
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil mengubah data pengajuan",
        pengajuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengubah data pengajuan",
        error: error.message,
      });
    }
  },

  updateStatusPengajuan: async (req, res) => {
    try {
      const { id } = req.params;
      const { status_pengajuan, catatan_admin } = req.body;

      const pengajuan = await Pengajuan.findById(id)
        .populate("bantuan_id", "judul")
        .populate("user_id", "nama");

      if (!pengajuan) {
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      }

      pengajuan.status_pengajuan =
        status_pengajuan ?? pengajuan.status_pengajuan;
      pengajuan.catatan_admin = catatan_admin ?? pengajuan.catatan_admin;

      await pengajuan.save();

      res.status(200).json({
        message: "Status pengajuan berhasil diperbarui",
        data: pengajuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengubah status pengajuan",
        error: error.message,
      });
    }
  },

  deletePengajuan: async (req, res) => {
    try {
      const deletedPengajuan = await Pengajuan.findByIdAndDelete(req.params.id);
      if (!deletedPengajuan) {
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil menghapus data pengajuan",
        deletedPengajuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menghapus data pengajuan",
        error: error.message,
      });
    }
  },
};
