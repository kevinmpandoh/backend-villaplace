"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Konfigurasi Multer Storage Dinamis
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (req.url.includes("villa")) {
            cb(null, "./src/assets/img/villa"); // Folder untuk foto profil
        }
        else if (req.url.includes("profile")) {
            cb(null, "./src/assets/img/profile"); // Folder untuk foto villa
        }
        else {
            cb(null, "./src/assets/img"); // Jika rute tidak sesuai
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname)); // Nama file dengan timestamp
    },
});
// Filter untuk memastikan hanya file gambar yang diizinkan
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images are allowed!"));
    }
};
// Inisialisasi multer dengan storage dan filter
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Batas ukuran file 5MB
    fileFilter: fileFilter,
});
exports.default = upload;
