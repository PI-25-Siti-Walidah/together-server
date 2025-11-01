const mongoose = require("mongoose");
const { Schema } = mongoose;

const testimoniSchema = new Schema(
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
  },
  { timestamps: true }
);

const Testimoni = mongoose.model("Testimoni", testimoniSchema);
module.exports = Testimoni;
