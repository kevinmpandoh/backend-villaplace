import express from "express";
import pesananRoutes from "./pesananRoutes";

const exampleRoutes = require("./example/exampleRoutes");
const router = express.Router();

// Use exampleRoutes
router.use("/example", exampleRoutes);
router.use("/pesanan", pesananRoutes);

module.exports = router;
