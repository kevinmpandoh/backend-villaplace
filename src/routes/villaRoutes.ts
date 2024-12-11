import { Router } from "express";
import upload from "../config/multerConfig";
import { verifyAdminOwner } from "../middleware/verifyToken";

const { verifyAdmin, verifyOwner } = require("../middleware/verifyToken");

const router = Router();
const {
  getAllVillas,
  getAllVillasOwner,
  getAllVillasAdmin,
  getVillaById,
  createVilla,
  updateVilla,
  deleteVilla,
  uploadVillaImages,
  getVillaImages,
  deleteVillaImage,
  updateVillaStatus,
  getBookedDatesByVillaId,
  editVillaImages,
} = require("../controllers/villaController");

router.put(
  "/:villaId/edit-villa-images/:photoId",
  upload.array("foto_villa"),
  editVillaImages
);

router.get("/", getAllVillas);
router.get("/owner/", verifyOwner, getAllVillasOwner);
router.get("/admin/", verifyAdmin, getAllVillasAdmin);

router.get("/:id", getVillaById);
router.post("/", verifyOwner, createVilla);
router.put("/:id", verifyOwner, updateVilla);
router.delete("/:id", verifyAdminOwner, deleteVilla);
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
