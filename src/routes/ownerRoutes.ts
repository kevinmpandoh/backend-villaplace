import express from "express";
const router = express.Router();
import {
  changePasswordOwner,
  deleteOwnerById,
  getAllOwners,
  getOwnerById,
  updateOwnerById,
  uploadProfileImagesOwner,
} from "../controllers/ownerController";
const {
  verifyUserLogin,
  verifyOwner,
  verifyAdmin,
} = require("../middleware/verifyToken");

import upload from "../config/multerConfig";
import { changePasswordUser } from "../controllers/user-controller";

//! OWNER ROUTES
router.post(
  "/user/:id/upload",
  verifyUserLogin,
  upload.single("foto_profile"),
  uploadProfileImagesOwner
);
router.get("/", verifyOwner, getAllOwners);
router.get("/:id", getOwnerById);
router.put("/:id", updateOwnerById);
router.delete("/:id", verifyAdmin, deleteOwnerById);
router.put("/change/:id", verifyOwner, changePasswordOwner);
router.post(
  "/owner/:id/upload",
  verifyOwner,
  upload.single("foto_profile"),
  uploadProfileImagesOwner
);
export default router;
