const fs = require("fs");
const path = require("path");
const Bantuan = require("../models/bantuan.model");
const Kategori = require("../models/kategori.model");
const Mitra = require("../models/mitra.model");

const publicDir = path.resolve(
  __dirname,
  "../../public/uploads/images/bantuan"
);

const safeUnlink = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("Gagal menghapus file:", err.message);
  }
};

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
      if (requiredFields.some((f) => !f))
        return res
          .status(400)
          .json({ success: false, message: "Semua field wajib diisi" });

      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "Foto bantuan wajib diunggah" });

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

      const foto = `uploads/images/bantuan/${req.file.filename}`;

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
        foto,
      });

      res.status(201).json({
        success: true,
        message: "Bantuan berhasil dibuat",
        data: bantuan,
      });
    } catch (error) {
      console.error(error);
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

      const bantuanList = await Bantuan.find(filter)
        .populate("kategori_id", "nama_kategori")
        .populate("mitra_id", "nama")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const totalData = await Bantuan.countDocuments(filter);
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
      console.error(error);
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

      if (req.file) {
        const oldPath = path.resolve(__dirname, "../../public", bantuan.foto);
        safeUnlink(oldPath);
        updateData.foto = `uploads/images/bantuan/${req.file.filename}`;
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

      const filePath = path.resolve(publicDir, path.basename(bantuan.foto));
      safeUnlink(filePath);
      await Bantuan.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Bantuan berhasil dihapus",
      });
    } catch (error) {
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
          const filePath = path.resolve(publicDir, path.basename(b.foto));
          safeUnlink(filePath);
        }
      }

      const result = await Bantuan.deleteMany({});
      res.status(200).json({
        success: true,
        message: "Semua bantuan berhasil dihapus",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghapus semua bantuan",
        error: error.message,
      });
    }
  },
};
