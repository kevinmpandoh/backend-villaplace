import express from "express";
import {
  changePasswordUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserCurrent,
  updateUserById,
  uploadProfileImagesUser,
} from "../controllers/userController";
const { verifyUserLogin } = require("../middleware/verifyToken");
const router = express.Router();
import upload from "../config/multerConfig";
const { verifyAdmin } = require("../middleware/verifyToken");
//! USER ROUTES
router.post(
  "/:id/upload",
  verifyUserLogin,
  upload.single("foto_profile"),
  uploadProfileImagesUser
);

router.get("/", getAllUsers);
router.get("/current-user", verifyUserLogin, getUserCurrent);
router.put("/change-password", verifyUserLogin, changePasswordUser);
router.get("/:id", verifyUserLogin, getUserById);
router.put("/:id", verifyUserLogin, updateUserById);
router.delete("/:id", verifyAdmin, deleteUserById);

export default router;
