const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");

const authRouter = require("./auth.route");
const userRouter = require("./user.route");
const kategoriRouter = require("./kategori.route");
const mitraRouter = require("./mitra.route");
const bantuanRouter = require("./bantuan.route");
const pengajuanRouter = require("./pengajuan.route");
const trackingPengajuanRouter = require("./tracking-pengajuan.route");
const formPengajuanRouter = require("./form-pengajuan.route");
const jawabanFormRouter = require("./jawaban-form.route");
const buktiPenerimaanRouter = require("./bukti-penerimaan.route");
const testimoniRouter = require("./testimoni.route");
const herAiRouter = require("./her-ai.route");

router.use("/auth", authRouter);
router.use("/users", verifyToken, userRouter);
router.use("/kategori", kategoriRouter);
router.use("/mitra", mitraRouter);
router.use("/bantuan", bantuanRouter);
router.use("/pengajuan", pengajuanRouter);
router.use("/tracking-pengajuan", trackingPengajuanRouter);
router.use("/form-pengajuan", formPengajuanRouter);
router.use("/jawaban-form", jawabanFormRouter);
router.use("/bukti-penerimaan", buktiPenerimaanRouter);
router.use("/testimoni", testimoniRouter);
router.use("/her-ai", herAiRouter);

module.exports = router;
