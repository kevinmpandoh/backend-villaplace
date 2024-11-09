import express from "express";
import pesananRoutes from "./pesananRoutes";

const villaRoutes = require("./villaRoutes");
const pembayaranRoutes = require("./pembayaranRoutes");
const exampleRoutes = require("./example/exampleRoutes");
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import ownerRoutes from "./ownerRoutes";
const router = express.Router();

// Use exampleRoutes
router.use("/example", exampleRoutes);
router.use("/pesanan", pesananRoutes);
router.use("/villa", villaRoutes);
router.use("/pembayaran", pembayaranRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/owner", ownerRoutes);

module.exports = router;
