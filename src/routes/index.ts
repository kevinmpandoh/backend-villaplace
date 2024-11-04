import express from "express";
import pesananRoutes from "./pesananRoutes";

const villaRoutes = require("./villaRoutes");
const exampleRoutes = require("./example/exampleRoutes");
const router = express.Router();

// Use exampleRoutes
router.use("/example", exampleRoutes);
router.use("/pesanan", pesananRoutes);
router.use("/villa", villaRoutes);

module.exports = router;
