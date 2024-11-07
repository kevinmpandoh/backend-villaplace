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
const pembayaranModel_1 = require("../models/pembayaranModel");
const midtransClient = require("midtrans-client");
const cron = require("node-cron");
const PembayaranController = {
    getAllPembayaran: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pembayaran = yield pembayaranModel_1.Pembayaran.find().populate("pesanan");
            return res.status(200).json({
                status: "success",
                message: "Success get all pembayaran",
                data: pembayaran,
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
    getPembayaranById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const pembayaran = yield pembayaranModel_1.Pembayaran.findById(req.params.id).populate("pesanan");
            if (!pembayaran) {
                return res.status(404).json({
                    status: "error",
                    message: "Pembayaran not found",
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Success get pembayaran by id",
                data: pembayaran,
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
    createPembayaran: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newPembayaran = new pembayaranModel_1.Pembayaran(req.body);
            const savedPembayaran = yield newPembayaran.save();
            return res.status(201).json({
                status: "success",
                message: "Pembayaran created successfully",
                data: savedPembayaran,
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
    updatePembayaran: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedPembayaran = yield pembayaranModel_1.Pembayaran.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!updatedPembayaran) {
                return res.status(404).json({
                    status: "error",
                    message: "Payment not found",
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Payment updated successfully",
                data: updatedPembayaran,
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
    deletePembayaran: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedPembayaran = yield pembayaranModel_1.Pembayaran.findByIdAndDelete(req.params.id);
            if (!deletedPembayaran) {
                return res.status(404).json({
                    status: "error",
                    message: "Payment not found",
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Payment deleted successfully",
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
    prosesPembayaran: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { nama_pembayar, email_pembayar, kode_pembayaran, jumlah_pembayaran, } = req.body;
            if (!nama_pembayar ||
                !email_pembayar ||
                !kode_pembayaran ||
                !jumlah_pembayaran) {
                return res.status(400).json({
                    status: "error",
                    message: "Bad request",
                    errors: "All fields are required",
                });
            }
            // cek apakah
            const snap = new midtransClient.Snap({
                isProduction: false,
                serverKey: process.env.MIDTRANS_SERVER_KEY,
            });
            const parameter = {
                transaction_details: {
                    order_id: kode_pembayaran,
                    gross_amount: jumlah_pembayaran,
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: nama_pembayar,
                    email: email_pembayar,
                },
            };
            const transaction = yield snap.createTransaction(parameter);
            res.status(201).json({
                status: "success",
                message: "Create payment successfull",
                data: transaction,
                // token: transaction.token,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                status: "error",
                message: "Internal server error",
            });
        }
    }),
};
module.exports = PembayaranController;
