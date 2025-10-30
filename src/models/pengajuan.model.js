const mongoose = require("mongoose");
const { Schema } = mongoose;

const pengajuanSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bantuan_id: {
      type: Schema.Types.ObjectId,
      ref: "Bantuan",
      required: true,
    },
    status_pengajuan: {
      type: String,
      enum: ["ditinjau", "disetujui", "ditolak", "Selesai"],
      default: "ditinjau",
    },
    catatan_admin: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Pengajuan = mongoose.model("Pengajuan", pengajuanSchema);
module.exports = Pengajuan;
