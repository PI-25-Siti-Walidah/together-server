const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({
        message: "Berhasil mengambil data user",
        users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data user",
        error: error.message,
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
      res.status(200).json({
        message: "Berhasil mengambil data user",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal mengambil data user",
        error: error.message,
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, username, password, no_telp, alamat } = req.body;

      const updateData = {};

      if (nama) updateData.nama = nama;
      if (username) updateData.username = username;
      if (no_telp) updateData.no_telp = no_telp;
      if (alamat) updateData.alamat = alamat;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil memperbarui data user",
        updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal memperbarui data user",
        error: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id).select(
        "-password"
      );

      if (!deletedUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.status(200).json({
        message: "Berhasil menghapus data user",
        deletedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Gagal menghapus data user",
        error: error.message,
      });
    }
  },
};
