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
Object.defineProperty(exports, "__esModule", { value: true });
const pesananModel_1 = require("../models/pesananModel");
const PesananController = {
    getAllPesanan: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pesanan = yield pesananModel_1.Pesanan.find()
                .populate({
                path: "villa",
                populate: [
                    {
                        path: "pemilik_villa",
                        model: "User",
                    },
                ],
            })
                .populate("user");
            return res.status(200).json({
                status: "success",
                message: "Success get all pesanan",
                data: pesanan,
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
    getPesananById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pesanan = yield pesananModel_1.Pesanan.findById(req.params.id).populate([
                {
                    path: "villa",
                    populate: [
                        {
                            path: "pemilik_villa",
                            model: "User",
                        },
                    ],
                },
                "user",
            ]);
            if (!pesanan) {
                return res.status(404).json({
                    status: "error",
                    message: "Pesanan not found",
                });
            }
            res.status(200).json({
                status: "success",
                message: "Success get pesanan by id",
                data: pesanan,
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
    createPesanan: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newPesanan = new pesananModel_1.Pesanan(req.body);
            const savedPesanan = yield newPesanan.save();
            res.status(201).json({
                status: "success",
                message: "Pesanan created successfully",
                data: savedPesanan,
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
    updatePesanan: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedPesanan = yield pesananModel_1.Pesanan.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedPesanan) {
                return res.status(404).json({
                    status: "error",
                    message: "Pesanan not found",
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Pesanan updated successfully",
                data: updatedPesanan,
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
    deletePesanan: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedPesanan = yield pesananModel_1.Pesanan.findByIdAndDelete(req.params.id);
            if (!deletedPesanan) {
                return res.status(404).json({ message: "Pesanan not found" });
            }
            res.status(200).json({
                status: "success",
                message: "Success delete pesanan by id",
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
};
module.exports = PesananController;
