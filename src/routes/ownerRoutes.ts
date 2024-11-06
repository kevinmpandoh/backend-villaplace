import express from "express";
import { registerOwner, login } from "../controllers/authController";

const router = express.Router();

router.post("/register-owner", registerOwner); // Register untuk owner
router.post("/login", login); // Login untuk owner

export default router;
