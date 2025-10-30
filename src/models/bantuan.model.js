const mongoose = require("mongoose");
const { Schema } = mongoose;

const bantuanSchema = new Schema(
  {
    kategori_id: {
      type: Schema.Types.ObjectId,
      ref: "Kategori",
      required: true,
    },
    mitra_id: {
      type: Schema.Types.ObjectId,
      ref: "Mitra",
      required: true,
    },
    judul: {
      type: String,
      required: true,
      trim: true,
    },
    deskripsi: {
      type: String,
      required: true,
      trim: true,
    },
    syarat: {
      type: [String],
      required: true,
    },
    jumlah_penerima: {
      type: Number,
      default: 0,
    },
    jangkauan: {
      type: String,
      required: true,
    },
    bentuk_bantuan: {
      type: String,
      required: true,
      trim: true,
    },
    nominal: {
      type: Number,
      default: 0,
    },
    periode_mulai: {
      type: Date,
      required: true,
    },
    periode_berakhir: {
      type: Date,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    foto: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Bantuan = mongoose.model("Bantuan", bantuanSchema);
module.exports = Bantuan;
