const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUploader = (folderName = "uploads", maxSizeMB = 5) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: folderName,
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
      ],
      resource_type: "auto",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    }),
  });

  return multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};

const uploadPublicFile = (folderName = "others") =>
  createUploader(folderName, 5);
const uploadPrivateFile = (folderName = "others") =>
  createUploader(folderName, 5);

module.exports = { uploadPublicFile, uploadPrivateFile };
