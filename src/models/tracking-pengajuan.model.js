const mongoose = require("mongoose");
const { Schema } = mongoose;

const trackingPengajuanSchema = new Schema(
  {
    pengajuan_id: {
      type: Schema.Types.ObjectId,
      ref: "Pengajuan",
      required: true,
    },
    status: {
      type: String,
      enum: ["diproses", "disetujui", "ditolak", "selesai"],
      required: true,
    },
    keterangan: {
      type: String,
      default: null,
    },
    tanggal: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TrackingPengajuan = mongoose.model(
  "TrackingPengajuan",
  trackingPengajuanSchema
);
module.exports = TrackingPengajuan;
