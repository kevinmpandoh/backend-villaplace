import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";

const router = require("./routes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set folder 'uploads' sebagai folder statis agar bisa diakses melalui URL
app.use(
  "/uploads/profile",
  express.static(path.join(__dirname, "./assets/img/profile"))
);
app.use(
  "/uploads/villa",
  express.static(path.join(__dirname, "./assets/img/villa"))
);

// Routes
app.use("/api", router);

export default app;
