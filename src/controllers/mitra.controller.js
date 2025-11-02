const fs = require("fs");
const path = require("path");
const Mitra = require("../models/mitra.model");

const publicDir = path.resolve(__dirname, "../../public/uploads/mitra");

const safeUnlink = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("Gagal menghapus file:", err.message);
  }
};

module.exports = {
  createMitra: async (req, res) => {
    try {
      const { nama, no_telp, alamat } = req.body;

      if (!nama || !no_telp || !alamat) {
        return res
          .status(400)
          .json({ success: false, message: "Semua field wajib diisi" });
      }

      let logo = null;
      if (req.file) {
        logo = `uploads/mitra/${req.file.filename}`;
      }

      const mitra = await Mitra.create({ nama, no_telp, alamat, logo });

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const logo_url = logo ? `${baseUrl}/${logo}` : null;

      res.status(201).json({
        success: true,
        message: "Mitra berhasil ditambahkan",
        data: { ...mitra._doc, logo_url },
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

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const dataWithUrl = mitraList.map((m) => ({
        ...m._doc,
        logo_url: m.logo ? `${baseUrl}/${m.logo}` : null,
      }));

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil semua data mitra",
        page: parseInt(page),
        totalPages,
        totalData,
        data: dataWithUrl,
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

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const logo_url = mitra.logo ? `${baseUrl}/${mitra.logo}` : null;

      res.status(200).json({
        success: true,
        message: "Berhasil mendapatkan data mitra",
        data: { ...mitra._doc, logo_url },
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

      if (req.file) {
        if (mitra.logo) {
          const oldPath = path.resolve(__dirname, "../../public", mitra.logo);
          safeUnlink(oldPath);
        }
        updateData.logo = `uploads/mitra/${req.file.filename}`;
      }

      const updated = await Mitra.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const logo_url = updated.logo ? `${baseUrl}/${updated.logo}` : null;

      res.status(200).json({
        success: true,
        message: "Mitra berhasil diperbarui",
        data: { ...updated._doc, logo_url },
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
        const filePath = path.resolve(publicDir, path.basename(mitra.logo));
        safeUnlink(filePath);
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
      const mitraList = await Mitra.find({});
      for (const m of mitraList) {
        if (m.logo) {
          const filePath = path.resolve(__dirname, "../../public", m.logo);
          safeUnlink(filePath);
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
