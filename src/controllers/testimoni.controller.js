const Testimoni = require("../models/testimoni.model");
const Pengajuan = require("../models/pengajuan.model");
const path = require("path");
const fs = require("fs");

const publicDir = path.resolve(__dirname, "../../public/uploads/testimoni");

const safeUnlink = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("⚠️ Gagal menghapus file:", err.message);
  }
};

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

      if (!req.file.mimetype.startsWith("image/")) {
        safeUnlink(req.file.path);
        return res.status(400).json({ message: "File harus berupa gambar" });
      }

      const fotoPath = `uploads/testimoni/${req.file.filename}`;

      const newTestimoni = await Testimoni.create({
        pengajuan_id,
        foto: fotoPath,
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

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const dataWithFullUrl = testimoniList.map((t) => ({
        ...t._doc,
        foto_url: `${baseUrl}/${t.foto}`,
      }));

      res.status(200).json({
        message: "Berhasil mengambil semua testimoni",
        count: dataWithFullUrl.length,
        data: dataWithFullUrl,
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

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const dataWithFullUrl = {
        ...testimoni._doc,
        foto_url: `${baseUrl}/${testimoni.foto}`,
      };

      res.status(200).json({
        message: "Berhasil mengambil data testimoni",
        data: dataWithFullUrl,
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

      if (req.file) {
        const oldPath = path.resolve(__dirname, "../../public", testimoni.foto);
        safeUnlink(oldPath);
        testimoni.foto = `uploads/testimoni/${req.file.filename}`;
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

      safeUnlink(path.resolve(__dirname, "../../public", testimoni.foto));
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
