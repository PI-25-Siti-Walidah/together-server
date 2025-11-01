const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ==== Upload gambar public ====
const uploadPublicImage = (folderName = "others") => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(
        __dirname,
        `../../public/uploads/images/${folderName}`
      );
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid =
      allowedTypes.test(file.mimetype) &&
      allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValid) cb(null, true);
    else
      cb(new Error("Hanya file gambar (jpeg, jpg, png, webp) yang diizinkan!"));
  };

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
  });
};

// ==== Upload gambar private ====
const uploadPrivateImage = (folderName = "others") => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(
        __dirname,
        `../../private/uploads/images/${folderName}`
      );
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid =
      allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
      allowedTypes.test(file.mimetype);

    if (isValid) cb(null, true);
    else cb(new Error("File gambar tidak valid!"));
  };

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
  });
};

// ==== Upload document private ====
const uploadPrivateDoc = (folderName = "documents") => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(
        __dirname,
        `../../private/uploads/documents/${folderName}`
      );
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xls|xlsx/;
    const isValid =
      allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
      allowedTypes.test(file.mimetype);

    if (isValid) cb(null, true);
    else
      cb(
        new Error("Hanya dokumen (PDF, DOC, DOCX, XLS, XLSX) yang diizinkan!")
      );
  };

  return multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
  });
};

module.exports = { uploadPublicImage, uploadPrivateImage, uploadPrivateDoc };
