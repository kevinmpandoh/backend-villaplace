"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const { getAllPesanan, getPesananById, createPesanan, updatePesanan, deletePesanan, } = require("../controllers/pesananController");
route.get("/", getAllPesanan);
route.post("/", createPesanan);
route.get("/:id", getPesananById);
route.put("/:id", updatePesanan);
route.delete("/:id", deletePesanan);
exports.default = route;
