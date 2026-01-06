import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed types
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf"
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only JPG, PNG images or PDF files are allowed"
      )
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 5MB
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
