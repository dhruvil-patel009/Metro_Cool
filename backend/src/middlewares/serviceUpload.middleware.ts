import multer from "multer";

const storage = multer.memoryStorage();

export const serviceUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});