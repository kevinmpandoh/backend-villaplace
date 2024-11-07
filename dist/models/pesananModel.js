"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pesanan = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const pesananSchema = new mongoose_1.Schema({
    harga: { type: Number, required: true },
    jumlah_orang: { type: Number, required: true },
    nama_pembayar: { type: String, required: true },
    email_pembayar: { type: String, required: true },
    catatan: { type: String },
    status: { type: String, default: "pending" },
    tanggal_mulai: { type: Date, required: true },
    tanggal_selesai: { type: Date, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    villa: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Villa",
        required: true,
    },
}, {
    timestamps: true,
});
exports.Pesanan = mongoose_1.default.model("Pesanan", pesananSchema);
