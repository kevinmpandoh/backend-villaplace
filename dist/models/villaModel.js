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
exports.Villa = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VillaSchema = new mongoose_1.Schema({
    nama: { type: String, required: true },
    deskripsi: { type: String, required: true },
    lokasi: { type: String, required: true },
    kategori: { type: [String], required: true },
    fasilitas: { type: [String], required: true },
    harga: { type: Number, required: true },
    foto_villa: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "VillaPhoto",
        },
    ],
    pemilik_villa: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Owner",
        required: true,
    },
    ulasan: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Ulasan" }],
    pesanan: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Pesanan" }],
}, { timestamps: true });
exports.Villa = mongoose_1.default.model("Villa", VillaSchema);
