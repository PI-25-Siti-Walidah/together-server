const Bantuan = require("../models/bantuan.model");
const Kategori = require("../models/kategori.model");
const Mitra = require("../models/mitra.model");
const { v2: cloudinary } = require("cloudinary");

module.exports = {
  createBantuan: async (req, res) => {
    try {
      const {
        kategori_id,
        mitra_id,
        judul,
        deskripsi,
        syarat,
        jumlah_penerima,
        jangkauan,
        bentuk_bantuan,
        nominal,
        periode_mulai,
        periode_berakhir,
        is_active,
      } = req.body;

      const requiredFields = [
        kategori_id,
        mitra_id,
        judul,
        deskripsi,
        syarat,
        jangkauan,
        bentuk_bantuan,
        periode_mulai,
        periode_berakhir,
      ];
      if (requiredFields.some((f) => !f)) {
        return res.status(400).json({
          success: false,
          message: "Semua field wajib diisi",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Foto bantuan wajib diunggah",
        });
      }

      const kategori = await Kategori.findById(kategori_id);
      if (!kategori)
        return res
          .status(404)
          .json({ success: false, message: "Kategori tidak ditemukan" });

      const mitra = await Mitra.findById(mitra_id);
      if (!mitra)
        return res
          .status(404)
          .json({ success: false, message: "Mitra tidak ditemukan" });

      if (new Date(periode_berakhir) <= new Date(periode_mulai))
        return res.status(400).json({
          success: false,
          message: "Periode berakhir harus setelah periode mulai",
        });

      let parsedSyarat = syarat;
      try {
        if (typeof syarat === "string") parsedSyarat = JSON.parse(syarat);
      } catch {
        parsedSyarat = [syarat];
      }

      const fotoUrl = req.file?.path || null;

      const bantuan = await Bantuan.create({
        kategori_id,
        mitra_id,
        judul,
        deskripsi,
        syarat: Array.isArray(parsedSyarat) ? parsedSyarat : [parsedSyarat],
        jumlah_penerima,
        jangkauan,
        bentuk_bantuan,
        nominal,
        periode_mulai,
        periode_berakhir,
        is_active,
        foto: fotoUrl,
      });

      res.status(201).json({
        success: true,
        message: "Bantuan berhasil dibuat",
        data: bantuan,
      });
    } catch (error) {
      console.error("❌ CREATE BANTUAN ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Gagal membuat data bantuan",
        error: error.message,
      });
    }
  },

  getAllBantuan: async (req, res) => {
    try {
      const {
        kategori_id,
        mitra_id,
        is_active,
        page = 1,
        limit = 8,
        search,
      } = req.query;

      const filter = {};
      if (is_active !== undefined) filter.is_active = is_active === "true";
      if (kategori_id) filter.kategori_id = kategori_id;
      if (mitra_id) filter.mitra_id = mitra_id;
      if (search) filter.judul = { $regex: search, $options: "i" };

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [bantuanList, totalData] = await Promise.all([
        Bantuan.find(filter)
          .populate("kategori_id", "nama_kategori")
          .populate("mitra_id", "nama")
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ createdAt: -1 }),
        Bantuan.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalData / parseInt(limit));

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua data bantuan",
        page: parseInt(page),
        totalPages,
        totalData,
        data: bantuanList,
      });
    } catch (error) {
      console.error("❌ GET ALL BANTUAN ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data bantuan",
        error: error.message,
      });
    }
  },

  getBantuanById: async (req, res) => {
    try {
      const bantuan = await Bantuan.findById(req.params.id)
        .populate("kategori_id", "nama_kategori")
        .populate("mitra_id", "nama");

      if (!bantuan)
        return res
          .status(404)
          .json({ success: false, message: "Bantuan tidak ditemukan" });

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan data bantuan",
        data: bantuan,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mendapatkan data bantuan",
        error: error.message,
      });
    }
  },

  updateBantuan: async (req, res) => {
    try {
      const { id } = req.params;
      const bantuan = await Bantuan.findById(id);
      if (!bantuan)
        return res
          .status(404)
          .json({ success: false, message: "Bantuan tidak ditemukan" });

      const updateData = req.body;

      if (updateData.kategori_id) {
        const kategori = await Kategori.findById(updateData.kategori_id);
        if (!kategori)
          return res
            .status(404)
            .json({ success: false, message: "Kategori tidak ditemukan" });
      }

      if (updateData.mitra_id) {
        const mitra = await Mitra.findById(updateData.mitra_id);
        if (!mitra)
          return res
            .status(404)
            .json({ success: false, message: "Mitra tidak ditemukan" });
      }

      const mulai = updateData.periode_mulai || bantuan.periode_mulai;
      const berakhir = updateData.periode_berakhir || bantuan.periode_berakhir;
      if (new Date(berakhir) <= new Date(mulai))
        return res.status(400).json({
          success: false,
          message: "Periode berakhir harus setelah periode mulai",
        });

      if (req.file && req.file.path) {
        if (bantuan.foto) {
          try {
            const parts = bantuan.foto.split("/");
            const publicId = `${parts[parts.length - 2]}/${
              parts[parts.length - 1].split(".")[0]
            }`;
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn(
              "⚠️ Gagal menghapus foto lama di Cloudinary:",
              err.message
            );
          }
        }
        updateData.foto = req.file.path;
      }

      const updated = await Bantuan.findByIdAndUpdate(id, updateData, {
        new: true,
      })
        .populate("kategori_id", "nama_kategori")
        .populate("mitra_id", "nama");

      res.status(200).json({
        success: true,
        message: "Bantuan berhasil diperbarui",
        data: updated,
      });
    } catch (error) {
      console.error("❌ UPDATE BANTUAN ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui data bantuan",
        error: error.message,
      });
    }
  },

  deleteBantuan: async (req, res) => {
    try {
      const bantuan = await Bantuan.findById(req.params.id);
      if (!bantuan)
        return res
          .status(404)
          .json({ success: false, message: "Bantuan tidak ditemukan" });

      if (bantuan.foto) {
        try {
          const parts = bantuan.foto.split("/");
          const publicId = `${parts[parts.length - 2]}/${
            parts[parts.length - 1].split(".")[0]
          }`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("⚠️ Gagal menghapus foto dari Cloudinary:", err.message);
        }
      }

      await Bantuan.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Bantuan berhasil dihapus",
      });
    } catch (error) {
      console.error("❌ DELETE BANTUAN ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus bantuan",
        error: error.message,
      });
    }
  },

  deleteAllBantuan: async (req, res) => {
    try {
      const bantuanList = await Bantuan.find({});
      for (const b of bantuanList) {
        if (b.foto) {
          try {
            const parts = b.foto.split("/");
            const publicId = `${parts[parts.length - 2]}/${
              parts[parts.length - 1].split(".")[0]
            }`;
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn(
              "⚠️ Gagal menghapus foto dari Cloudinary:",
              err.message
            );
          }
        }
      }

      const result = await Bantuan.deleteMany({});
      res.status(200).json({
        success: true,
        message: "Semua bantuan berhasil dihapus",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.error("❌ DELETE ALL BANTUAN ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Gagal menghapus semua bantuan",
        error: error.message,
      });
    }
  },
};
