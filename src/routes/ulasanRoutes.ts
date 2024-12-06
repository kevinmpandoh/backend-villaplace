import { Router } from "express";
const router = Router();

const {
  getAllUlasan,
  getUlasanByIdUser,
  getAllUlasanByOwner,
  createUlasan,
  getUlasanById,
  updateUlasanById,
  deleteUlasanByUser,
  deleteUlasan,
} = require("../controllers/ulasanController");
const { verifyUserLogin, verifyAdmin, verifyOwner } = require("../middleware/verifyToken");
router.get("/", verifyAdmin, getAllUlasan);
router.get("/owner/", verifyOwner, getAllUlasanByOwner);
router.get("/:id", verifyAdmin, getUlasanById);
router.delete("/:id", verifyAdmin, deleteUlasan);
router.get("/:id", verifyOwner, getUlasanById);
router.get("/user/", verifyUserLogin, getUlasanByIdUser);
router.post("/", verifyUserLogin, createUlasan);
router.put("/:id", verifyUserLogin, updateUlasanById);
router.delete("/:id", verifyUserLogin, deleteUlasanByUser)
module.exports = router;
