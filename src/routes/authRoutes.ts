// import express from "express";
// import { register, login, test } from "../controllers/authController";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.get("/test", test);
// export default router;
// ????
import express from "express";
import { register, login, logout } from "../controllers/authController";

const router = express.Router();

router.post("/register", register); // Untuk user biasa
router.post("/login", login); // Login untuk user biasa
router.post("/logout", logout); // Logout untuk semua pengguna
export default router;
