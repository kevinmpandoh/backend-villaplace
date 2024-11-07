"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const router = require("./routes");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Set folder 'uploads' sebagai folder statis agar bisa diakses melalui URL
app.use("/uploads/profile", express_1.default.static(path_1.default.join(__dirname, "./assets/img/profile")));
app.use("/uploads/villa", express_1.default.static(path_1.default.join(__dirname, "./assets/img/villa")));
// Routes
app.use("/api", router);
exports.default = app;
