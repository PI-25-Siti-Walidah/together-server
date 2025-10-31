const mongoose = require("mongoose");
const { Schema } = mongoose;

const jawabanForm = new Schema(
  {
    pengajuan_id: {
      type: Schema.Types.ObjectId,
      ref: "Pengajuan",
      required: true,
    },
    form_id: {
      type: Schema.Types.ObjectId,
      ref: "FormPengajuan",
      required: true,
    },
    jawaban: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const JawabanForm = mongoose.model("JawabanForm", jawabanForm);
module.exports = JawabanForm;
