import express from "express";
import multer from "multer";
import {
  listServices,
  addServiceInclude,
  addServiceAddon,
  addServiceFaq,
  getServiceContentById,
  getAllServiceContent,
  assignContentToService
} from "../controllers/serviceContent.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/list", listServices);
router.get("/all", getAllServiceContent);
router.get("/:serviceId", getServiceContentById);
router.post("/include", addServiceInclude);
router.post("/addon", upload.single("image"), addServiceAddon);
router.post("/faq", addServiceFaq);
router.put("/:serviceId/assign", assignContentToService);

export default router;