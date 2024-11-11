import { Router } from "express";
const { verifyUserLogin } = require("../middleware/verifyToken");
const router = Router();
const {
  getAllFavorite,
  createFavorite,
  deleteFavorite,
  deleteFavoriteByDetail,
} = require("../controllers/favoriteController");
router.get("/", verifyUserLogin, getAllFavorite);
router.post("/", verifyUserLogin, createFavorite);
router.delete("/:id", verifyUserLogin, deleteFavorite);
router.delete("/detail/:id", verifyUserLogin, deleteFavoriteByDetail);

module.exports = router;
