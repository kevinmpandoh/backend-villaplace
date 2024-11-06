import express from "express";
import pesananRoutes from "./pesananRoutes";

const villaRoutes = require("./villaRoutes");
const pembayaranRoutes = require("./pembayaranRoutes");
const exampleRoutes = require("./example/exampleRoutes");
import authRoutes from "./authRoutes";

const router = express.Router();

// Use exampleRoutes
router.use("/example", exampleRoutes);
router.use("/pesanan", pesananRoutes);
router.use("/villa", villaRoutes);
router.use("/pembayaran", pembayaranRoutes);
router.use("/auth", authRoutes); // Routes untuk user biasa

// router.use("/owner", ownerRoutes); // Routes untuk owner
module.exports = router;
