const BuktiPenerimaan = require("../models/bukti-penerimaan.model");
const Pengajuan = require("../models/pengajuan.model");
const path = require("path");
const fs = require("fs");

const privateDir = path.resolve(
  __dirname,
  "../../private/uploads/bukti-penerimaan"
);

const safeUnlink = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("⚠️ Gagal menghapus file:", err.message);
  }
};

module.exports = {
  createBuktiPenerimaan: async (req, res) => {
    try {
      const { pengajuan_id, keterangan } = req.body;

      if (!req.file)
        return res.status(400).json({ message: "Foto bukti wajib diunggah" });

      if (!pengajuan_id || !keterangan)
        return res
          .status(400)
          .json({ message: "Field pengajuan_id dan keterangan wajib diisi" });

      const pengajuan = await Pengajuan.findById(pengajuan_id);
      if (!pengajuan) {
        safeUnlink(path.join(privateDir, req.file.filename));
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      }

      if (!req.file.mimetype.startsWith("image/")) {
        safeUnlink(req.file.path);
        return res.status(400).json({ message: "File harus berupa gambar" });
      }

      const fotoPath = `private/uploads/bukti-penerimaan/${req.file.filename}`;

      const bukti = await BuktiPenerimaan.create({
        pengajuan_id,
        foto: fotoPath,
        keterangan: keterangan.trim(),
      });

      res.status(201).json({
        message: "Bukti penerimaan berhasil ditambahkan",
        data: bukti,
      });
    } catch (error) {
      console.error("❌ CREATE ERROR:", error);
      res.status(500).json({
        message: "Gagal menambahkan bukti penerimaan",
        error: error.message,
      });
    }
  },

  getAllBuktiPenerimaan: async (req, res) => {
    try {
      const { pengajuan_id } = req.query;
      const filter = pengajuan_id ? { pengajuan_id } : {};

      const buktiList = await BuktiPenerimaan.find(filter)
        .populate("pengajuan_id", "judul status_pengajuan")
        .sort({ createdAt: -1 });

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const dataWithFullUrl = buktiList.map((bukti) => ({
        ...bukti._doc,
        foto_url: bukti.foto
          ? `${baseUrl}/files/private/uploads/bukti-penerimaan/${path.basename(
              bukti.foto
            )}`
          : null,
      }));

      res.status(200).json({
        message: "Berhasil mengambil semua bukti penerimaan",
        count: dataWithFullUrl.length,
        data: dataWithFullUrl,
      });
    } catch (error) {
      console.error("❌ GET ALL ERROR:", error);
      res.status(500).json({
        message: "Gagal mengambil data bukti penerimaan",
        error: error.message,
      });
    }
  },

  getBuktiPenerimaanById: async (req, res) => {
    try {
      const bukti = await BuktiPenerimaan.findById(req.params.id).populate(
        "pengajuan_id",
        "judul status_pengajuan"
      );

      if (!bukti)
        return res
          .status(404)
          .json({ message: "Bukti penerimaan tidak ditemukan" });

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const dataWithFullUrl = {
        ...bukti._doc,
        foto_url: bukti.foto
          ? `${baseUrl}/files/private/uploads/bukti-penerimaan/${path.basename(
              bukti.foto
            )}`
          : null,
      };

      res.status(200).json({
        message: "Berhasil mengambil data bukti penerimaan",
        data: dataWithFullUrl,
      });
    } catch (error) {
      console.error("❌ GET BY ID ERROR:", error);
      res.status(500).json({
        message: "Gagal mengambil data bukti penerimaan",
        error: error.message,
      });
    }
  },

  verifyBuktiPenerimaan: async (req, res) => {
    try {
      const { id } = req.params;
      const { status_verifikasi, catatan_admin } = req.body;

      if (!["disetujui", "ditolak"].includes(status_verifikasi)) {
        return res.status(400).json({
          message:
            "Status verifikasi tidak valid. Gunakan 'disetujui' atau 'ditolak'.",
        });
      }

      const bukti = await BuktiPenerimaan.findById(id);
      if (!bukti)
        return res
          .status(404)
          .json({ message: "Bukti penerimaan tidak ditemukan" });

      bukti.status_verifikasi = status_verifikasi;
      bukti.catatan_admin = catatan_admin || "";
      await bukti.save();

      res.status(200).json({
        message: `Bukti penerimaan berhasil ${
          status_verifikasi === "disetujui" ? "disetujui" : "ditolak"
        } oleh admin.`,
        data: bukti,
      });
    } catch (error) {
      console.error("❌ VERIFY ERROR:", error);
      res.status(500).json({
        message: "Gagal memverifikasi bukti penerimaan",
        error: error.message,
      });
    }
  },

  updateBuktiPenerimaan: async (req, res) => {
    try {
      const { id } = req.params;
      const { keterangan } = req.body;

      const bukti = await BuktiPenerimaan.findById(id);
      if (!bukti)
        return res
          .status(404)
          .json({ message: "Bukti penerimaan tidak ditemukan" });

      if (req.file) {
        safeUnlink(path.resolve(__dirname, "../../", bukti.foto));
        bukti.foto = `private/uploads/bukti-penerimaan/${req.file.filename}`;
      }

      if (keterangan) bukti.keterangan = keterangan.trim();

      await bukti.save();

      res.status(200).json({
        message: "Bukti penerimaan berhasil diperbarui",
        data: bukti,
      });
    } catch (error) {
      console.error("❌ UPDATE ERROR:", error);
      res.status(500).json({
        message: "Gagal memperbarui bukti penerimaan",
        error: error.message,
      });
    }
  },

  deleteBuktiPenerimaan: async (req, res) => {
    try {
      const bukti = await BuktiPenerimaan.findById(req.params.id);
      if (!bukti)
        return res
          .status(404)
          .json({ message: "Bukti penerimaan tidak ditemukan" });

      const oldPath = path.resolve(
        __dirname,
        "../../private/uploads/bukti-penerimaan",
        path.basename(bukti.foto)
      );
      safeUnlink(oldPath);
      await BuktiPenerimaan.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Bukti penerimaan berhasil dihapus" });
    } catch (error) {
      console.error("❌ DELETE ERROR:", error);
      res.status(500).json({
        message: "Gagal menghapus bukti penerimaan",
        error: error.message,
      });
    }
  },
};
