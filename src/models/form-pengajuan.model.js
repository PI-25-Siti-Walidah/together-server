const mongoose = require("mongoose");
const { Schema } = mongoose;

const formPengajuanShema = new Schema({
  kategori_id: {
    type: Schema.Types.ObjectId,
    ref: "Kategori",
    default: null,
  },
  bantuan_id: {
    type: Schema.Types.ObjectId,
    ref: "Bantuan",
    default: null,
  },
  nama_field: {
    type: String,
    required: true,
    trim: true,
  },
  type_field: {
    type: String,
    required: true,
    trim: true,
    enum: ["text", "number", "select", "radio", "checkbox", "date", "file"],
  },
  is_required: {
    type: Boolean,
    default: true,
  },
  opsi: {
    type: [String],
    default: [],
  },
  is_general: {
    type: Boolean,
    default: false,
  },
});

const FormPengajuan = mongoose.model("FormPengajuan", formPengajuanShema);
module.exports = FormPengajuan;
