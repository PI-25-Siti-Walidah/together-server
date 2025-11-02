const TrackingPengajuan = require("../models/tracking-pengajuan.model");
const Pengajuan = require("../models/pengajuan.model");

module.exports = {
  createTrackingPengajuan: async (req, res) => {
    try {
      const { pengajuan_id, status, keterangan } = req.body;

      const pengajuan = await Pengajuan.findById(pengajuan_id);
      if (!pengajuan) {
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      }

      const allowedStatus = ["diproses", "disetujui", "ditolak", "selesai"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `Status tidak valid. Gunakan salah satu dari: ${allowedStatus.join(
            ", "
          )}`,
        });
      }

      const lastTracking = await TrackingPengajuan.findOne({
        pengajuan_id,
      }).sort({ createdAt: -1 });

      if (lastTracking && lastTracking.status === status) {
        return res.status(400).json({
          message: `Status pengajuan sudah "${status}", tidak perlu diperbarui.`,
        });
      }

      const trackingPengajuan = await TrackingPengajuan.create({
        pengajuan_id,
        status,
        keterangan,
        tanggal: Date.now(),
      });

      pengajuan.status_pengajuan = status;
      await pengajuan.save();

      res.status(201).json({
        message: "Tracking pengajuan berhasil ditambahkan",
        data: trackingPengajuan,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal membuat tracking pengajuan",
        error: error.message,
      });
    }
  },

  getAllTrackingPengajuan: async (req, res) => {
    try {
      const { pengajuan_id } = req.query;
      const filter = pengajuan_id ? { pengajuan_id } : {};

      const trackingList = await TrackingPengajuan.find(filter)
        .populate({
          path: "pengajuan_id",
          populate: [
            { path: "bantuan_id", select: "judul" },
            { path: "user_id", select: "nama username" },
          ],
        })
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Data tracking berhasil diambil",
        data: trackingList,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data tracking",
        error: error.message,
      });
    }
  },

  getTrackingPengajuanById: async (req, res) => {
    try {
      const tracking = await TrackingPengajuan.findById(req.params.id).populate(
        {
          path: "pengajuan_id",
          populate: [
            { path: "bantuan_id", select: "judul bentuk_bantuan" },
            { path: "user_id", select: "nama username" },
          ],
        }
      );

      if (!tracking) {
        return res.status(404).json({ message: "Tracking tidak ditemukan" });
      }

      res.status(200).json({
        message: "Detail tracking berhasil diambil",
        data: tracking,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Terjadi kesalahan saat mengambil data tracking",
        error: error.message,
      });
    }
  },

  updateTrackingPengajuan: async (req, res) => {
    try {
      const { status, keterangan } = req.body;

      const allowedStatus = ["diproses", "disetujui", "ditolak", "selesai"];
      if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `Status tidak valid. Gunakan salah satu dari: ${allowedStatus.join(
            ", "
          )}`,
        });
      }

      const tracking = await TrackingPengajuan.findByIdAndUpdate(
        req.params.id,
        { status, keterangan, tanggal: Date.now() },
        { new: true }
      );

      if (!tracking) {
        return res.status(404).json({ message: "Tracking tidak ditemukan" });
      }

      const pengajuan = await Pengajuan.findById(tracking.pengajuan_id);
      if (pengajuan && status) {
        pengajuan.status_pengajuan = status;
        await pengajuan.save();
      }

      res.status(200).json({
        message: "Tracking pengajuan berhasil diperbarui",
        data: tracking,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal memperbarui tracking pengajuan",
        error: error.message,
      });
    }
  },

  deleteTrackingPengajuan: async (req, res) => {
    try {
      const tracking = await TrackingPengajuan.findByIdAndDelete(req.params.id);

      if (!tracking) {
        return res.status(404).json({ message: "Tracking tidak ditemukan" });
      }

      res.status(200).json({
        message: "Tracking berhasil dihapus",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menghapus tracking pengajuan",
        error: error.message,
      });
    }
  },
};
