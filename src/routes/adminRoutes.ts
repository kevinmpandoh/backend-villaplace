import { Router } from "express";
const { verifyAdmin } = require("../middleware/verifyToken");
const router = Router();

const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  getAdminCurrent,
  changePasswordAdmin,
  deleteAdminById,
} = require("../controllers/adminController");

router.post("/", verifyAdmin, createAdmin);
router.get("/", verifyAdmin, getAllAdmins);
router.get("/current-admin", verifyAdmin, getAdminCurrent);
router.get("/:id", verifyAdmin, getAdminById);
router.put("/change-password", verifyAdmin, changePasswordAdmin);
router.put("/:id", verifyAdmin, updateAdminById);
router.delete("/:id", verifyAdmin, deleteAdminById);

module.exports = router;
