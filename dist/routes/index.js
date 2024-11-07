"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pesananRoutes_1 = __importDefault(require("./pesananRoutes"));
const villaRoutes = require("./villaRoutes");
const pembayaranRoutes = require("./pembayaranRoutes");
const exampleRoutes = require("./example/exampleRoutes");
const router = express_1.default.Router();
// Use exampleRoutes
router.use("/example", exampleRoutes);
router.use("/pesanan", pesananRoutes_1.default);
router.use("/villa", villaRoutes);
router.use("/pembayaran", pembayaranRoutes);
module.exports = router;
