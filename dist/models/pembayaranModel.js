"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pembayaran = void 0;
const mongoose_1 = require("mongoose");
const PembayaranSchema = new mongoose_1.Schema({
    kode_pembayaran: { type: String, required: true, unique: true },
    status_pembayaran: { type: String, required: true },
    tanggal_pembayaran: { type: Date, default: Date.now },
    metode_pembayaran: { type: String, required: true },
    jumlah_pembayaran: { type: Number, required: true },
    nomor_va: { type: String, default: null },
    cara_pembayaran: { type: String, required: true },
    pesanan: { type: mongoose_1.Schema.Types.ObjectId, ref: "Pesanan", required: true },
});
exports.Pembayaran = (0, mongoose_1.model)("Pembayaran", PembayaranSchema);
