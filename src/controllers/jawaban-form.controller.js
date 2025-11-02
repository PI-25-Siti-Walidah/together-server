const JawabanForm = require("../models/jawaban-form.model");
const Pengajuan = require("../models/pengajuan.model");
const FormPengajuan = require("../models/form-pengajuan.model");
const path = require("path");
const fs = require("fs");

const privateDir = path.resolve(
  __dirname,
  "../../private/uploads/jawaban-form"
);

if (!fs.existsSync(privateDir)) {
  fs.mkdirSync(privateDir, { recursive: true });
}

const safeUnlink = (filePath) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.warn("⚠️ Gagal menghapus file:", err.message);
  }
};

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
          safeUnlink(req.file.path);
          return res.status(400).json({ message: "Tipe file tidak diizinkan" });
        }

        jawabanValue = `private/uploads/jawaban-form/${req.file.filename}`;
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

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const dataWithUrl = jawabanForms.map((item) => ({
        ...item._doc,
        jawaban_url:
          item.form_id?.type_field === "file"
            ? `${baseUrl}/files/private/uploads/jawaban-form/${path.basename(
                item.jawaban
              )}`
            : null,
      }));

      res.status(200).json({
        message: "Berhasil mengambil semua jawaban form",
        count: dataWithUrl.length,
        data: dataWithUrl,
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

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const dataWithUrl = {
        ...jawaban._doc,
        jawaban_url:
          jawaban.form_id?.type_field === "file"
            ? `${baseUrl}/files/private/uploads/jawaban-form/${path.basename(
                jawaban.jawaban
              )}`
            : null,
      };

      res.status(200).json({
        message: "Berhasil mengambil data jawaban form",
        data: dataWithUrl,
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

      const jawabanForm = await JawabanForm.findById(id);
      if (!jawabanForm)
        return res
          .status(404)
          .json({ message: "Jawaban form tidak ditemukan" });

      let updatedValue = jawabanForm.jawaban;

      if (req.file) {
        const oldPath = path.resolve(__dirname, "../../", jawabanForm.jawaban);
        safeUnlink(oldPath);
        updatedValue = `private/uploads/jawaban-form/${req.file.filename}`;
      } else if (jawaban) {
        updatedValue = jawaban.trim();
      }

      jawabanForm.jawaban = updatedValue;
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
      const jawabanForm = await JawabanForm.findById(req.params.id);
      if (!jawabanForm)
        return res
          .status(404)
          .json({ message: "Jawaban form tidak ditemukan" });

      if (jawabanForm.jawaban?.startsWith("private/uploads/")) {
        const filePath = path.resolve(__dirname, "../../", jawabanForm.jawaban);
        safeUnlink(filePath);
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
