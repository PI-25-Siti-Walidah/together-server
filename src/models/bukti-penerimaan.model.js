const mongoose = require("mongoose");
const { Schema } = mongoose;

const buktiPenerimaanSchema = new Schema(
  {
    pengajuan_id: {
      type: Schema.Types.ObjectId,
      ref: "Pengajuan",
      required: true,
    },
    foto: {
      type: String,
      required: true,
      trim: true,
    },
    keterangan: {
      type: String,
      required: true,
      trim: true,
    },
    status_verifikasi: {
      type: String,
      enum: ["diverifikasi", "disetujui", "ditolak"],
      default: "diverifikasi",
    },
    catatan_admin: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const BuktiPenerimaan = mongoose.model(
  "BuktiPenerimaan",
  buktiPenerimaanSchema
);
module.exports = BuktiPenerimaan;
