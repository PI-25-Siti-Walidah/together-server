const FormPengajuan = require("../models/form-pengajuan.model");
const Bantuan = require("../models/bantuan.model");
const Kategori = require("../models/kategori.model");

module.exports = {
  createFormPengajuan: async (req, res) => {
    try {
      const {
        kategori_id,
        bantuan_id,
        nama_field,
        type_field,
        is_required,
        opsi,
        is_general,
      } = req.body;

      const allowedTypes = [
        "text",
        "number",
        "select",
        "radio",
        "checkbox",
        "date",
        "file",
      ];
      if (!allowedTypes.includes(type_field)) {
        return res.status(400).json({
          message: `type_field tidak valid. Gunakan salah satu dari: ${allowedTypes.join(
            ", "
          )}`,
        });
      }

      if (is_general) {
        if (kategori_id || bantuan_id) {
          return res.status(400).json({
            message:
              "Pertanyaan general tidak boleh memiliki kategori_id atau bantuan_id",
          });
        }
      } else {
        if (kategori_id && bantuan_id) {
          return res.status(400).json({
            message:
              "Pertanyaan tidak boleh memiliki kategori_id dan bantuan_id sekaligus",
          });
        }
        if (!kategori_id && !bantuan_id) {
          return res.status(400).json({
            message:
              "Pertanyaan harus memiliki kategori_id ATAU bantuan_id, atau tandai sebagai general",
          });
        }
      }

      if (kategori_id) {
        const kategori = await Kategori.findById(kategori_id);
        if (!kategori)
          return res.status(404).json({ message: "Kategori tidak ditemukan" });
      }

      if (bantuan_id) {
        const bantuan = await Bantuan.findById(bantuan_id);
        if (!bantuan)
          return res.status(404).json({ message: "Bantuan tidak ditemukan" });
      }

      const newField = await FormPengajuan.create({
        kategori_id: kategori_id || null,
        bantuan_id: bantuan_id || null,
        nama_field,
        type_field,
        is_required,
        opsi,
        is_general: !!is_general,
      });

      res.status(201).json({
        message: "Form pengajuan berhasil dibuat",
        data: newField,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal membuat form pengajuan",
        error: error.message,
      });
    }
  },

  getAllFormPengajuan: async (req, res) => {
    try {
      const { bantuan_id, kategori_id, is_general } = req.query;
      const filter = {};

      if (bantuan_id) filter.bantuan_id = bantuan_id;
      if (kategori_id) filter.kategori_id = kategori_id;
      if (is_general !== undefined) filter.is_general = is_general === "true";

      const forms = await FormPengajuan.find(filter)
        .populate("kategori_id", "nama_kategori")
        .populate("bantuan_id", "judul")
        .sort({ _id: -1 });

      res.status(200).json({
        message: "Berhasil mengambil semua form pengajuan",
        data: forms,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data form pengajuan",
        error: error.message,
      });
    }
  },

  getFormPengajuanById: async (req, res) => {
    try {
      const form = await FormPengajuan.findById(req.params.id)
        .populate("kategori_id", "nama_kategori")
        .populate("bantuan_id", "judul");

      if (!form) {
        return res
          .status(404)
          .json({ message: "Form pengajuan tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil mengambil data form pengajuan",
        data: form,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data form pengajuan",
        error: error.message,
      });
    }
  },

  updateFormPengajuan: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        kategori_id,
        bantuan_id,
        nama_field,
        type_field,
        is_required,
        opsi,
        is_general,
      } = req.body;

      const allowedTypes = [
        "text",
        "number",
        "select",
        "radio",
        "checkbox",
        "date",
        "file",
      ];
      if (type_field && !allowedTypes.includes(type_field)) {
        return res.status(400).json({
          message: `type_field tidak valid. Gunakan salah satu dari: ${allowedTypes.join(
            ", "
          )}`,
        });
      }

      if (is_general) {
        if (kategori_id || bantuan_id) {
          return res.status(400).json({
            message:
              "Pertanyaan general tidak boleh memiliki kategori_id atau bantuan_id",
          });
        }
      } else {
        if (kategori_id && bantuan_id) {
          return res.status(400).json({
            message:
              "Pertanyaan tidak boleh memiliki kategori_id dan bantuan_id sekaligus",
          });
        }
      }

      const updatedForm = await FormPengajuan.findByIdAndUpdate(
        id,
        {
          kategori_id: kategori_id || null,
          bantuan_id: bantuan_id || null,
          nama_field,
          type_field,
          is_required,
          opsi,
          is_general: !!is_general,
        },
        { new: true }
      );

      if (!updatedForm) {
        return res
          .status(404)
          .json({ message: "Form pengajuan tidak ditemukan" });
      }

      res.status(200).json({
        message: "Form pengajuan berhasil diperbarui",
        data: updatedForm,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal memperbarui form pengajuan",
        error: error.message,
      });
    }
  },

  deleteFormPengajuan: async (req, res) => {
    try {
      const deleted = await FormPengajuan.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Form pengajuan tidak ditemukan" });
      }

      res.status(200).json({
        message: "Form pengajuan berhasil dihapus",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menghapus form pengajuan",
        error: error.message,
      });
    }
  },
};
