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

  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, username, no_telp, alamat } = req.body;

      const updateData = { nama, username, no_telp, alamat };

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.status(200).json({
        message: "Profil berhasil diperbarui",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Gagal memperbarui profil",
        error: error.message,
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "Konfirmasi password tidak cocok" });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password lama salah" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password berhasil diperbarui" });
    } catch (error) {
      res.status(500).json({
        message: "Gagal memperbarui password",
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
