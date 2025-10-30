const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const kategoriRouter = require("./kategori.route");
const mitraRouter = require("./mitra.route");
const bantuanRouter = require("./bantuan.route");
const pengajuanRouter = require("./pengajuan.route");

router.use("/auth", authRouter);
router.use("/users", verifyToken, userRouter);
router.use("/kategori", verifyToken, kategoriRouter);
router.use("/mitra", verifyToken, mitraRouter);
router.use("/bantuan", verifyToken, bantuanRouter);
router.use("/pengajuan", verifyToken, pengajuanRouter);

module.exports = router;
