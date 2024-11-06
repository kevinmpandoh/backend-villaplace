"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const villaModel_1 = require("../models/villaModel");
const villaPhotoModel_1 = require("../models/villaPhotoModel");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const VillaController = {
    getAllVillas: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { kategori, lokasi, harga_min, harga_max } = req.query;
            let query = {};
            // Tambahkan filter kategori jika ada
            if (kategori) {
                query.kategori = kategori;
            }
            // Tambahkan filter lokasi jika ada
            if (lokasi) {
                query.lokasi = lokasi;
            }
            // Tambahkan filter harga_min jika ada
            if (harga_min) {
                query.harga = Object.assign(Object.assign({}, query.harga), { $gte: Number(harga_min) });
            }
            // Tambahkan filter harga_max jika ada
            if (harga_max) {
                query.harga = Object.assign(Object.assign({}, query.harga), { $lte: Number(harga_max) });
            }
            const villas = yield villaModel_1.Villa.find(query).populate([
                {
                    path: "ulasan",
                    populate: {
                        path: "user",
                        select: "nama",
                    },
                },
                "pemilik_villa",
                "pesanan",
                "foto_villa",
            ]);
            return res.status(200).json({
                status: "success",
                message: "Success get all villas",
                data: villas,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    }),
    getVillaById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const villa = yield villaModel_1.Villa.findById(req.params.id).populate([
                {
                    path: "ulasan",
                    populate: {
                        path: "user",
                        select: "nama",
                    },
                },
                "pemilik_villa",
                "pesanan",
            ]);
            if (!villa) {
                return res.status(404).json({
                    status: "error",
                    message: "Villa not found",
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Success get villa by id",
                data: villa,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    }),
    createVilla: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newVilla = new villaModel_1.Villa(req.body);
            const savedVilla = yield newVilla.save();
            return res.status(201).json({
                status: "success",
                message: "Villa created successfully",
                data: savedVilla,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    }),
    updateVilla: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedVilla = yield villaModel_1.Villa.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedVilla) {
                return res.status(404).json({
                    status: "error",
                    message: "Villa not found",
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Villa updated successfully",
                data: updatedVilla,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    }),
    deleteVilla: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deletedVilla = yield villaModel_1.Villa.findByIdAndDelete(id);
            console.log(deletedVilla, "deletedVilla");
            if (!deletedVilla) {
                return res.status(404).json({
                    status: "error",
                    message: "Villa not found",
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Villa deleted successfully",
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            });
        }
    }),
    uploadVillaImages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const villaId = req.params.id;
            const imageFiles = req.files;
            if (!imageFiles || imageFiles.length === 0) {
                return res.status(400).json({ message: "No files were uploaded." });
            }
            // Buat array objek foto dengan URL dan nama file
            const photos = yield Promise.all(imageFiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                const photo = yield villaPhotoModel_1.VillaPhoto.create({
                    url: `${req.protocol}://${req.get("host")}/images/villa/${file.filename}`,
                    name: file.filename,
                    villa: villaId,
                    filepath: file.path,
                });
                return photo._id; // Mengembalikan ID foto yang baru dibuat
            })));
            const villa = yield villaModel_1.Villa.findByIdAndUpdate(villaId, { $push: { foto_villa: { $each: photos } } }, { new: true });
            if (!villa) {
                return res.status(404).json({ message: "Villa not found" });
            }
            res.status(201).json({
                status: "success",
                message: "Villa images uploaded successfully",
                data: villa,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Failed to upload villa images",
            });
        }
    }),
    getVillaImages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const villaId = req.params.id;
            const villa = yield villaModel_1.Villa.findById(villaId).populate("foto_villa");
            if (!villa) {
                return res
                    .status(404)
                    .json({ status: "error", message: "Villa not found" });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all photo villa by id villa",
                photos: villa.foto_villa,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Failed to get villa photos",
            });
        }
    }),
    deleteVillaImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const villaId = req.params.id;
            const photoId = req.params.photoId;
            // Temukan villa dan pastikan foto ada di dalamnya
            const villa = yield villaModel_1.Villa.findById(villaId);
            if (!villa) {
                return res.status(404).json({ message: "Villa not found" });
            }
            // Periksa apakah photoId ada di dalam array photos
            const isPhotoExist = villa.foto_villa.some((photo) => photo.toString() === photoId);
            if (!isPhotoExist) {
                return res
                    .status(404)
                    .json({ status: "error", message: "Photo not found" });
            }
            // cari foto_villa berdasarkan photoId
            const villaPhoto = yield villaPhotoModel_1.VillaPhoto.findById(photoId);
            if (!villaPhoto) {
                return res.status(404).json({ message: "Photo not found" });
            }
            // Hapus file dari sistem file
            const filePath = path_1.default.join(__dirname, "..", "..", villaPhoto.filepath);
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.error("Failed to delete file:", err);
                    return res.status(500).json({ message: "Failed to delete file" });
                }
            });
            // Hapus foto dari collection Photo
            yield villaPhotoModel_1.VillaPhoto.findByIdAndDelete(photoId);
            // Hapus ID foto dari array photos di dokumen villa
            villa.foto_villa = villa.foto_villa.filter((image) => image.toString() !== photoId);
            yield villa.save();
            res.status(200).json({
                status: "success",
                message: "Photo deleted successfully",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Failed to delete villa photo",
            });
        }
    }),
};
module.exports = VillaController;
