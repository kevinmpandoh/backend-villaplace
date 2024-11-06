"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const router = (0, express_1.Router)();
const { getAllVillas, getVillaById, createVilla, updateVilla, deleteVilla, uploadVillaImages, getVillaImages, deleteVillaImage, } = require("../controllers/villaController");
router.get("/", getAllVillas);
router.get("/:id", getVillaById);
router.post("/", createVilla);
router.put("/:id", updateVilla);
router.delete("/:id", deleteVilla);
router.post("/:id/upload-villa", multerConfig_1.default.array("foto_villa", 10), uploadVillaImages);
router.get("/:id/photos", getVillaImages);
router.delete("/:id/photos/:photoId", deleteVillaImage);
module.exports = router;
