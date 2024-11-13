import express from "express";
const router = express.Router();
import {
  changePasswordOwner,
  deleteOwnerById,
  getAllOwners,
  getOwnerById,
  getOwnerCurrent,
  updateOwnerById,
  uploadProfileImagesOwner,
} from "../controllers/ownerController";
const {
  verifyUserLogin,
  verifyOwner,
  verifyAdmin,
} = require("../middleware/verifyToken");

import upload from "../config/multerConfig";
import { changePasswordUser } from "../controllers/userController";

//! OWNER ROUTES
router.post(
  "/:id/upload",
  verifyOwner,
  upload.single("foto_profile"),
  uploadProfileImagesOwner
);
router.get("/", verifyOwner, getAllOwners);
router.put("/change-password", verifyOwner, changePasswordOwner);
router.get("/current-owner", verifyOwner, getOwnerCurrent);
router.get("/:id", getOwnerById);
router.put("/:id", updateOwnerById);
router.delete("/:id", verifyAdmin, deleteOwnerById);
router.post(
  "/owner/:id/upload",
  verifyOwner,
  upload.single("foto_profile"),
  uploadProfileImagesOwner
);
export default router;
