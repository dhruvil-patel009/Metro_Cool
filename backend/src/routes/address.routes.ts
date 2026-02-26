import express from "express"
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/", protect, getUserAddresses)
router.post("/", protect, createAddress)
router.put("/:id", protect, updateAddress)
router.delete("/:id", protect, deleteAddress)
router.patch("/:id/default", protect, setDefaultAddress)

export default router