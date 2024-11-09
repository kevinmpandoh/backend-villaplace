import express from "express";
import {
  changePasswordUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserCurrent,
  updateUserById,
  uploadProfileImagesUser,
} from "../controllers/user-controller";
const { verifyUserLogin } = require("../middleware/verifyToken");
const router = express.Router();
import upload from "../config/multerConfig";
const { verifyAdmin } = require("../middleware/verifyToken");
//! USER ROUTES
router.get("/", getAllUsers);
router.get("/:id", verifyUserLogin, getUserById);
router.put("/:id", verifyUserLogin, updateUserById);
router.delete("/:id", verifyAdmin, deleteUserById);
router.put("/user/change-password", verifyUserLogin, changePasswordUser);
router.get("/user/current-user", verifyUserLogin, getUserCurrent);
router.post(
  "/user/:id/upload",
  verifyUserLogin,
  upload.single("foto_profile"),
  uploadProfileImagesUser
);

export default router;
