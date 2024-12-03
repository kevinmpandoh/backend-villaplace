import { Router } from "express";
import upload from "../config/multerConfig";

const { verifyAdmin, verifyOwner } = require("../middleware/verifyToken");

const router = Router();
const {
  getAllVillas,
  getAllVillasOwner,
  getVillaById,
  createVilla,
  updateVilla,
  deleteVilla,
  uploadVillaImages,
  getVillaImages,
  deleteVillaImage,
  updateVillaStatus,
  getBookedDatesByVillaId,
} = require("../controllers/villaController");

router.get("/", getAllVillas);
router.get("/owner/:id", verifyOwner, getAllVillasOwner);

router.get("/:id", getVillaById);
router.post("/", verifyOwner, createVilla);
router.put("/:id", verifyOwner, updateVilla);
router.delete("/:id", verifyAdmin, deleteVilla);
router.post(
  "/:id/upload-villa",
  upload.array("foto_villa", 10),
  uploadVillaImages
);
router.get("/:id/photos", getVillaImages);
router.delete("/:id/photos/:photoId", deleteVillaImage);
router.patch("/:id/change-status", verifyAdmin, updateVillaStatus);
router.get("/:id/booked-dates", getBookedDatesByVillaId); // Tambahkan route baru

module.exports = router;
