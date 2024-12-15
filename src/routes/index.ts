import express from "express";
import pesananRoutes from "./pesananRoutes";

const villaRoutes = require("./villaRoutes");
const pembayaranRoutes = require("./pembayaranRoutes");
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import ownerRoutes from "./ownerRoutes";
import route from "./pesananRoutes";
const ulasanRoutes = require("./ulasanRoutes");
const favoriteRoutes = require("./favoriteRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

// Use exampleRoutes

router.use("/pesanan", pesananRoutes);
router.use("/auth", authRoutes);
router.use("/villa", villaRoutes);
router.use("/pembayaran", pembayaranRoutes);
router.use("/user", userRoutes);
router.use("/owner", ownerRoutes);
router.use("/ulasan", ulasanRoutes);
router.use("/favorite", favoriteRoutes);
router.use("/admin", adminRoutes);

router.get("/", (req, res) => {
  res.send("Hello from express");
});

module.exports = router;
