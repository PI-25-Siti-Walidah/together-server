const JawabanForm = require("../models/jawaban-form.model");
const Pengajuan = require("../models/pengajuan.model");
const FormPengajuan = require("../models/form-pengajuan.model");

module.exports = {
  createJawabanForm: async (req, res) => {
    try {
      const { pengajuan_id, form_id, jawaban } = req.body;

      if (!pengajuan_id || !form_id || !jawaban) {
        return res.status(400).json({
          message: "Field pengajuan_id, form_id, dan jawaban wajib diisi",
        });
      }

      const pengajuan = await Pengajuan.findById(pengajuan_id);
      if (!pengajuan)
        return res.status(404).json({ message: "Pengajuan tidak ditemukan" });

      const form = await FormPengajuan.findById(form_id);
      if (!form)
        return res
          .status(404)
          .json({ message: "Form pengajuan tidak ditemukan" });

      const existing = await JawabanForm.findOne({ pengajuan_id, form_id });
      if (existing) {
        return res.status(400).json({
          message:
            "Jawaban untuk form ini sudah pernah diisi dalam pengajuan ini",
        });
      }

      const newJawaban = await JawabanForm.create({
        pengajuan_id,
        form_id,
        jawaban,
      });

      res.status(201).json({
        message: "Jawaban form berhasil disimpan",
        data: newJawaban,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menyimpan jawaban form",
        error: error.message,
      });
    }
  },

  getAllJawabanForm: async (req, res) => {
    try {
      const { pengajuan_id, form_id } = req.query;
      const filter = {};

      if (pengajuan_id) filter.pengajuan_id = pengajuan_id;
      if (form_id) filter.form_id = form_id;

      const jawabanForms = await JawabanForm.find(filter)
        .populate({
          path: "pengajuan_id",
          select: "status_pengajuan hasil_keputusan createdAt",
          populate: {
            path: "user_id",
            select: "nama username",
          },
        })
        .populate({
          path: "form_id",
          select: "nama_field type_field is_required",
        })
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Berhasil mengambil semua jawaban form",
        data: jawabanForms,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data jawaban form",
        error: error.message,
      });
    }
  },

  getJawabanFormById: async (req, res) => {
    try {
      const jawaban = await JawabanForm.findById(req.params.id)
        .populate({
          path: "pengajuan_id",
          select: "status_pengajuan hasil_keputusan createdAt",
          populate: {
            path: "user_id",
            select: "nama username",
          },
        })
        .populate({
          path: "form_id",
          select: "nama_field type_field is_required",
        });

      if (!jawaban) {
        return res
          .status(404)
          .json({ message: "Jawaban form tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil mengambil data jawaban form",
        data: jawaban,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data jawaban form",
        error: error.message,
      });
    }
  },

  updateJawabanForm: async (req, res) => {
    try {
      const { id } = req.params;
      const { jawaban } = req.body;

      if (!jawaban) {
        return res.status(400).json({ message: "Field jawaban wajib diisi" });
      }

      const updated = await JawabanForm.findByIdAndUpdate(
        id,
        { jawaban },
        { new: true }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ message: "Jawaban form tidak ditemukan" });
      }

      res.status(200).json({
        message: "Jawaban form berhasil diperbarui",
        data: updated,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal memperbarui jawaban form",
        error: error.message,
      });
    }
  },

  deleteJawabanForm: async (req, res) => {
    try {
      const deleted = await JawabanForm.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Jawaban form tidak ditemukan" });
      }

      res.status(200).json({ message: "Jawaban form berhasil dihapus" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menghapus jawaban form",
        error: error.message,
      });
    }
  },
};
