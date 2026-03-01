// middlewares/upload.middleware.ts
import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();


  // Allowed types
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",   // fallback
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only JPG, PNG, WEBP or PDF allowed`
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 50MB
  },
  fileFilter
});

/**
 * ✅ Use this for registration
 */
export const registerUpload = upload.fields([
  { name: "profile_photo", maxCount: 1 },
  { name: "aadhaar_pan", maxCount: 1 }
]);
