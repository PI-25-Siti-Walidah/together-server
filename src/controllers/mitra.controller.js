const Mitra = require("../models/mitra.model");
const { v2: cloudinary } = require("cloudinary");

module.exports = {
  createMitra: async (req, res) => {
    try {
      const { nama, no_telp, alamat } = req.body;

      if (!nama || !no_telp || !alamat) {
        return res
          .status(400)
          .json({ success: false, message: "Semua field wajib diisi" });
      }

      const logoUrl = req.file?.path || null;

      const mitra = await Mitra.create({
        nama,
        no_telp,
        alamat,
        logo: logoUrl,
      });

      res.status(201).json({
        success: true,
        message: "Mitra berhasil ditambahkan",
        data: mitra,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan mitra",
        error: error.message,
      });
    }
  },

  getAllMitra: async (req, res) => {
    try {
      const { search, page = 1, limit = 10 } = req.query;

      const filter = {};
      if (search) filter.nama = { $regex: search, $options: "i" };

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const mitraList = await Mitra.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const totalData = await Mitra.countDocuments(filter);
      const totalPages = Math.ceil(totalData / parseInt(limit));

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua data mitra",
        page: parseInt(page),
        totalPages,
        totalData,
        data: mitraList,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mengambil data mitra",
        error: error.message,
      });
    }
  },

  getMitraById: async (req, res) => {
    try {
      const mitra = await Mitra.findById(req.params.id);
      if (!mitra)
        return res
          .status(404)
          .json({ success: false, message: "Mitra tidak ditemukan" });

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan data mitra",
        data: mitra,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal mendapatkan data mitra",
        error: error.message,
      });
    }
  },

  updateMitra: async (req, res) => {
    try {
      const { id } = req.params;
      const mitra = await Mitra.findById(id);
      if (!mitra)
        return res
          .status(404)
          .json({ success: false, message: "Mitra tidak ditemukan" });

      const updateData = req.body;

      if (req.file && req.file.path) {
        if (mitra.logo) {
          try {
            const parts = mitra.logo.split("/");
            const publicId = `${parts[parts.length - 2]}/${
              parts[parts.length - 1].split(".")[0]
            }`;
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn(
              "⚠️ Gagal menghapus file lama Cloudinary:",
              err.message
            );
          }
        }
        updateData.logo = req.file.path;
      }

      const updated = await Mitra.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Mitra berhasil diperbarui",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui data mitra",
        error: error.message,
      });
    }
  },

  deleteMitra: async (req, res) => {
    try {
      const mitra = await Mitra.findById(req.params.id);
      if (!mitra)
        return res
          .status(404)
          .json({ success: false, message: "Mitra tidak ditemukan" });

      if (mitra.logo) {
        try {
          const parts = mitra.logo.split("/");
          const publicId = `${parts[parts.length - 2]}/${
            parts[parts.length - 1].split(".")[0]
          }`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("⚠️ Gagal menghapus file lama Cloudinary:", err.message);
        }
      }

      await Mitra.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Mitra berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghapus mitra",
        error: error.message,
      });
    }
  },

  deleteAllMitra: async (req, res) => {
    try {
      const allMitra = await Mitra.find();

      for (const mitra of allMitra) {
        if (mitra.logo) {
          try {
            const parts = mitra.logo.split("/");
            const publicId = `${parts[parts.length - 2]}/${
              parts[parts.length - 1].split(".")[0]
            }`;
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn("⚠️ Gagal menghapus file Cloudinary:", err.message);
          }
        }
      }

      const result = await Mitra.deleteMany({});
      res.status(200).json({
        success: true,
        message: "Semua mitra berhasil dihapus",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Gagal menghapus semua mitra",
        error: error.message,
      });
    }
  },
};
