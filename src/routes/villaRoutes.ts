import { Router } from "express";
import upload from "../config/multerConfig";
const { verifyOwner } = require("../middleware/verifyOwner");
const router = Router();
const {
  getAllVillas,
  getVillaById,
  createVilla,
  updateVilla,
  deleteVilla,
  uploadVillaImages,
  getVillaImages,
  deleteVillaImage,
} = require("../controllers/villaController");

router.get("/", verifyOwner, getAllVillas);
router.get("/:id", getVillaById);
router.post("/", createVilla);
router.put("/:id", updateVilla);
router.delete("/:id", deleteVilla);
router.post(
  "/:id/upload-villa",
  upload.array("foto_villa", 10),
  uploadVillaImages
);
router.get("/:id/photos", getVillaImages);
router.delete("/:id/photos/:photoId", deleteVillaImage);

module.exports = router;
