import { Router } from "express";
const router = Router();

const {
  getAllUlasan,
  getUlasanByIdUser,
  createUlasan,
  getUlasanById,
  updateUlasanById,
  deleteUlasanByUser,
  deleteUlasan,
} = require("../controllers/ulasanController");
const { verifyUserLogin, verifyAdmin } = require("../middleware/verifyToken");
router.get("/", verifyAdmin, getAllUlasan);
router.get("/user/", verifyUserLogin, getUlasanByIdUser);
router.get("/:id", verifyAdmin, getUlasanById);
router.post("/", verifyUserLogin, createUlasan);
router.put("/:id", verifyUserLogin, updateUlasanById);
router.delete("/:id", verifyUserLogin, deleteUlasanByUser);
router.delete("/admin/:id", verifyAdmin, deleteUlasan);

module.exports = router;
