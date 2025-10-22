import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
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
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
