const mongoose = require("mongoose");
const { Schema } = mongoose;

const kategoriSchema = new Schema(
  {
    nama_kategori: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Kategori = mongoose.model("Kategori", kategoriSchema);
module.exports = Kategori;
