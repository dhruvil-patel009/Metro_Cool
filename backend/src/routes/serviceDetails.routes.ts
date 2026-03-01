import express from "express";
import { getFullServiceDetails } from "../controllers/service.controller.js";

const router = express.Router();

router.get("/:id", getFullServiceDetails);

export default router;