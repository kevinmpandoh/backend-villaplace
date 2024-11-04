import express from "express";
import pesananRoutes from "./pesananRoutes";

const villaRoutes = require("./villaRoutes");
const pembayaranRoutes = require("./pembayaranRoutes");
const exampleRoutes = require("./example/exampleRoutes");

const router = express.Router();

// Use exampleRoutes
router.use("/example", exampleRoutes);
router.use("/pesanan", pesananRoutes);
router.use("/villa", villaRoutes);
router.use("/pembayaran", pembayaranRoutes);

module.exports = router;
