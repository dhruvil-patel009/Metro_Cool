import express from "express";
import multer from "multer";
import {
  listServices,
  addServiceInclude,
  addServiceAddon,
  addServiceFaq
} from "../controllers/serviceContent.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/list", listServices);
router.post("/include", addServiceInclude);
router.post("/addon", upload.single("image"), addServiceAddon);
router.post("/faq", addServiceFaq);

export default router;