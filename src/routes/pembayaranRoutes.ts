import { Router } from "express";
const { verifyUserLogin, verifyOwner } = require("../middleware/verifyToken");
const {
  getAllPembayaran,
  getPembayaranById,
  getPembayaranByIdUser,
  getMidtransStatus,
  getPembayaranByIdOwner,
  getPembayaranByMonth,
  createPembayaran,
  updatePembayaran,
  deletePembayaran,
  prosesPembayaran,
} = require("../controllers/pembayaranController");

const router = Router();

router.get("/", getAllPembayaran);
router.get("/user", verifyUserLogin, getPembayaranByIdUser);
router.get("/chart", verifyOwner, getPembayaranByMonth);
router.get("/owner", verifyOwner, getPembayaranByIdOwner);
router.get("/status/:order_id", getMidtransStatus);
router.get("/:id", getPembayaranById);
router.post("/", createPembayaran);
router.put("/:id", updatePembayaran);
router.delete("/:id", deletePembayaran);
router.post("/transaksi", prosesPembayaran);

module.exports = router;
