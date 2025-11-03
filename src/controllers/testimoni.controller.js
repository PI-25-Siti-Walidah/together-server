const Testimoni = require("../models/testimoni.model");
const Pengajuan = require("../models/pengajuan.model");
const { v2: cloudinary } = require("cloudinary");

module.exports = {
  createTestimoni: async (req, res) => {
    try {
      const { pengajuan_id, keterangan } = req.body;

      if (!req.file)
        return res
          .status(400)
          .json({ message: "Foto testimoni wajib diunggah" });

      if (!pengajuan_id || !keterangan)
        return res
          .status(400)
          .json({ message: "Field pengajuan_id dan keterangan wajib diisi" });

      const pengajuan = await Pengajuan.findById(pengajuan_id);
      if (!pengajuan) {
        safeUnlink(path.join(publicDir, req.file.filename));
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      }

      const newTestimoni = await Testimoni.create({
        pengajuan_id,
        foto: req.file.path,
        keterangan: keterangan.trim(),
      });

      res.status(201).json({
        message: "Testimoni berhasil ditambahkan",
        data: newTestimoni,
      });
    } catch (error) {
      console.error("❌ CREATE TESTIMONI ERROR:", error);
      res.status(500).json({
        message: "Gagal menambahkan testimoni",
        error: error.message,
      });
    }
  },

  getAllTestimoni: async (req, res) => {
    try {
      const { pengajuan_id } = req.query;
      const filter = pengajuan_id ? { pengajuan_id } : {};

      const testimoniList = await Testimoni.find(filter)
        .populate("pengajuan_id", "judul status_pengajuan")
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Berhasil mengambil semua testimoni",
        count: testimoniList.length,
        data: testimoniList,
      });
    } catch (error) {
      console.error("❌ GET ALL TESTIMONI ERROR:", error);
      res.status(500).json({
        message: "Gagal mengambil data testimoni",
        error: error.message,
      });
    }
  },

  getTestimoniById: async (req, res) => {
    try {
      const testimoni = await Testimoni.findById(req.params.id).populate(
        "pengajuan_id",
        "judul status_pengajuan"
      );

      if (!testimoni)
        return res.status(404).json({ message: "Testimoni tidak ditemukan" });

      res.status(200).json({
        message: "Berhasil mengambil data testimoni",
        data: testimoni,
      });
    } catch (error) {
      console.error("❌ GET TESTIMONI BY ID ERROR:", error);
      res.status(500).json({
        message: "Gagal mengambil data testimoni",
        error: error.message,
      });
    }
  },

  updateTestimoni: async (req, res) => {
    try {
      const { id } = req.params;
      const { keterangan } = req.body;

      const testimoni = await Testimoni.findById(id);
      if (!testimoni)
        return res.status(404).json({ message: "Testimoni tidak ditemukan" });

      if (req.file && testimoni.foto) {
        try {
          const parts = testimoni.foto.split("/");
          const publicId = `${parts[parts.length - 2]}/${
            parts[parts.length - 1].split(".")[0]
          }`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("⚠️ Gagal menghapus file lama Cloudinary:", err.message);
        }
        testimoni.foto = req.file.path;
      }

      if (keterangan) testimoni.keterangan = keterangan.trim();

      await testimoni.save();

      res.status(200).json({
        message: "Testimoni berhasil diperbarui",
        data: testimoni,
      });
    } catch (error) {
      console.error("❌ UPDATE TESTIMONI ERROR:", error);
      res.status(500).json({
        message: "Gagal memperbarui testimoni",
        error: error.message,
      });
    }
  },

  deleteTestimoni: async (req, res) => {
    try {
      const testimoni = await Testimoni.findById(req.params.id);
      if (!testimoni)
        return res.status(404).json({ message: "Testimoni tidak ditemukan" });

      if (testimoni.foto) {
        try {
          const parts = testimoni.foto.split("/");
          const publicId = `${parts[parts.length - 2]}/${
            parts[parts.length - 1].split(".")[0]
          }`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("⚠️ Gagal menghapus file dari Cloudinary:", err.message);
        }
      }
      await Testimoni.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Testimoni berhasil dihapus" });
    } catch (error) {
      console.error("❌ DELETE TESTIMONI ERROR:", error);
      res.status(500).json({
        message: "Gagal menghapus testimoni",
        error: error.message,
      });
    }
  },
};
