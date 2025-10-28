const mongoose = require("mongoose");
const { Schema } = mongoose;

const mitraSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    no_telp: {
      type: String,
      required: true,
      trim: true,
    },
    alamat: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Mitra = mongoose.model("Mitra", mitraSchema);
module.exports = Mitra;
