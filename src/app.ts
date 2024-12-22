import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import { Request, Response } from "express";

import "./schedulers/updateStatusPesanan";
import "./schedulers/updateStatusPembayaran";

const router = require("./routes");
const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-villaplace.vercel.app/",
];

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// cookie parse
app.use(cookieParser());
// Middleware
app.use(
  cors({
    origin: "https://frontend-villaplace.vercel.app/",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set folder 'uploads' sebagai folder statis agar bisa diakses melalui URL
app.use(
  "/images/user-profile",
  express.static(path.join(__dirname, "./assets/img/profile/user"))
);
app.use(
  "/images/villa",
  express.static(path.join(__dirname, "./assets/img/villa"))
);
app.use(
  "/images/owner-profile",
  express.static(path.join(__dirname, "./assets/img/profile/owner"))
);

// Routes
app.use("/api", router);

router.get("/", (req: Request, res: Response) => {
  res.send("Hello from express");
});

// Route jika tidak ada route yang terdaftar
app.use((req, res) => {
  res.status(404).json({
    status: "Failed",
    message: "Resource tidak ditemukan",
  });
});

export default app;
