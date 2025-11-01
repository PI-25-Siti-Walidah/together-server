const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/private/images/:folder/:filename", verifyToken, (req, res) => {
  const { folder, filename } = req.params;
  const filePath = path.resolve(
    __dirname,
    `../../private/uploads/images/${folder}/${filename}`
  );

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
});

module.exports = router;
