const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const createUploader = (baseDir, folderName, maxSizeMB = 5) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(__dirname, `${baseDir}/${folderName}`);
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedExt = /\.(jpeg|jpg|png|webp|pdf|doc|docx|xls|xlsx)$/i;
    const allowedMime = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const isExtValid = allowedExt.test(file.originalname.toLowerCase());
    const isMimeValid = allowedMime.includes(file.mimetype);

    if (isExtValid && isMimeValid) cb(null, true);
    else
      cb(
        new Error(
          "Hanya file gambar atau dokumen (jpg, png, pdf, doc, xls, dll) yang diizinkan!"
        )
      );
  };

  return multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter,
  });
};

// ==== Upload file public ====
const uploadPublicFile = (folderName = "others") =>
  createUploader(path.join(__dirname, "../../public/uploads"), folderName, 5);

// ==== Upload file private ====
const uploadPrivateFile = (folderName = "others") =>
  createUploader(path.join(__dirname, "../../private/uploads"), folderName, 5);

module.exports = { uploadPublicFile, uploadPrivateFile };
