import express from "express";
const { verifyUserLogin, verifyOwner } = require("../middleware/verifyToken");
const route = express.Router();

const {
  getAllPesanan,
  getPesananById,
  getPesananByIdUser,
  getPesananByIdOwner,
  createPesanan,
  createPesananOwner,
  updatePesanan,
  deletePesanan,
} = require("../controllers/pesananController");

route.get("/", getAllPesanan);
route.post("/", verifyUserLogin, createPesanan);
route.post("/createPesananOwner", verifyOwner, createPesananOwner);
route.get("/owner", verifyOwner, getPesananByIdOwner);
route.get("/user", verifyUserLogin, getPesananByIdUser);
route.get("/:id", getPesananById);
route.put("/:id", updatePesanan);
route.delete("/:id", deletePesanan);

export default route;
