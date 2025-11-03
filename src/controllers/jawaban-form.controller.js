const JawabanForm = require("../models/jawaban-form.model");
const Pengajuan = require("../models/pengajuan.model");
const FormPengajuan = require("../models/form-pengajuan.model");
const { v2: cloudinary } = require("cloudinary");

module.exports = {
  createJawabanForm: async (req, res) => {
    try {
      const { pengajuan_id, form_id, jawaban } = req.body;

      if (!pengajuan_id || !form_id) {
        return res.status(400).json({
          message: "Field pengajuan_id dan form_id wajib diisi",
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

      let jawabanValue = jawaban;

      if (form.type_field === "file") {
        if (!req.file)
          return res.status(400).json({ message: "File wajib diunggah" });

        const allowedMime = [
          "image/jpeg",
          "image/png",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedMime.includes(req.file.mimetype)) {
          return res.status(400).json({ message: "Tipe file tidak diizinkan" });
        }

        // simpan URL cloudinary
        jawabanValue = req.file.path;
      } else if (!jawaban) {
        return res.status(400).json({ message: "Jawaban wajib diisi" });
      }

      const newJawaban = await JawabanForm.create({
        pengajuan_id,
        form_id,
        jawaban: jawabanValue,
      });

      res.status(201).json({
        message: "Jawaban form berhasil disimpan",
        data: newJawaban,
      });
    } catch (error) {
      console.error("❌ CREATE JAWABAN FORM ERROR:", error);
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
        count: jawabanForms.length,
        data: jawabanForms,
      });
    } catch (error) {
      console.error("❌ GET ALL JAWABAN FORM ERROR:", error);
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

      if (!jawaban)
        return res
          .status(404)
          .json({ message: "Jawaban form tidak ditemukan" });

      res.status(200).json({
        message: "Berhasil mengambil data jawaban form",
        data: jawaban,
      });
    } catch (error) {
      console.error("❌ GET JAWABAN FORM BY ID ERROR:", error);
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

      const jawabanForm = await JawabanForm.findById(id).populate("form_id");
      if (!jawabanForm)
        return res
          .status(404)
          .json({ message: "Jawaban form tidak ditemukan" });

      if (req.file && jawabanForm.form_id.type_field === "file") {
        if (jawabanForm.jawaban) {
          try {
            const parts = jawabanForm.jawaban.split("/");
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

        jawabanForm.jawaban = req.file.path;
      } else if (jawaban) {
        jawabanForm.jawaban = jawaban.trim();
      }

      await jawabanForm.save();

      res.status(200).json({
        message: "Jawaban form berhasil diperbarui",
        data: jawabanForm,
      });
    } catch (error) {
      console.error("❌ UPDATE JAWABAN FORM ERROR:", error);
      res.status(500).json({
        message: "Gagal memperbarui jawaban form",
        error: error.message,
      });
    }
  },

  deleteJawabanForm: async (req, res) => {
    try {
      const jawabanForm = await JawabanForm.findById(req.params.id).populate(
        "form_id"
      );
      if (!jawabanForm)
        return res
          .status(404)
          .json({ message: "Jawaban form tidak ditemukan" });

      if (jawabanForm.form_id.type_field === "file" && jawabanForm.jawaban) {
        try {
          const parts = jawabanForm.jawaban.split("/");
          const publicId = `${parts[parts.length - 2]}/${
            parts[parts.length - 1].split(".")[0]
          }`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("⚠️ Gagal menghapus file Cloudinary:", err.message);
        }
      }

      await JawabanForm.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Jawaban form berhasil dihapus" });
    } catch (error) {
      console.error("❌ DELETE JAWABAN FORM ERROR:", error);
      res.status(500).json({
        message: "Gagal menghapus jawaban form",
        error: error.message,
      });
    }
  },
};
