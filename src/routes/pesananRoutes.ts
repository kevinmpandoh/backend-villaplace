import express from "express";
const route = express.Router();

const {
  getAllPesanan,
  getPesananById,
  createPesanan,
  updatePesanan,
  deletePesanan,
} = require("../controllers/pesananController");

route.get("/", getAllPesanan);
route.post("/", createPesanan);
route.get("/:id", getPesananById);
route.put("/:id", updatePesanan);
route.delete("/:id", deletePesanan);

export default route;
