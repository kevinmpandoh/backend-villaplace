// ????
import express from "express";
import { register, login, logout } from "../controllers/authController";

const router = express.Router();

router.post("/register", register); // Untuk user biasa
router.post("/login", login); // Login untuk user biasa
router.post("/logout", logout); // Logout untuk semua pengguna
export default router;
//! dijadikan satu semua routes admin user owner
