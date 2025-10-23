const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");

const authRouter = require("./auth.route");
const userRouter = require("./user.route");

router.use("/auth", authRouter);
router.use("/users", verifyToken, userRouter);

module.exports = router;
