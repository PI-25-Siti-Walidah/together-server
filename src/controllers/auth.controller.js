const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");

module.exports = {
  register: async (req, res) => {
    try {
      const { nama, username, password, no_telp, alamat } = req.body;
      if (!nama || !username || !password || !no_telp || !alamat) {
        return res.status(400).json({
          message: "Nama, username, password, no_telp, dan alamat harus diisi",
        });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username sudah digunakan" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        nama,
        username,
        password: hashedPassword,
        no_telp,
        alamat,
      });
      await newUser.save();

      res.status(201).json({
        message: "Registrasi berhasil",
        user: {
          _id: newUser._id,
          nama: newUser.nama,
          username: newUser.username,
          no_telp: newUser.no_telp,
          alamat: newUser.alamat,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Terjadi kesalahan server",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username dan password harus diisi" });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Username atau password salah" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Username atau password salah" });
      }

      const token = generateToken(user);

      res.status(200).json({
        message: "Login berhasil",
        token,
        user: {
          _id: user._id,
          nama: user.nama,
          username: user.username,
          no_telp: user.no_telp,
          alamat: user.alamat,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Terjadi kesalahan server",
        error: error.message,
      });
    }
  },
};
