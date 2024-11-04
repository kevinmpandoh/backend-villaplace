import mongoose, { Schema } from "mongoose";
import { IPesanan } from "../types/Pesanan";

const pesananSchema: Schema = new Schema(
  {
    harga: { type: Number, required: true },
    jumlah_orang: { type: Number, required: true },
    nama_pembayar: { type: String, required: true },
    email_pembayar: { type: String, required: true },
    catatan: { type: String },
    status: { type: String, default: "pending" },
    tanggal_mulai: { type: Date, required: true },
    tanggal_selesai: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    villa: {
      type: Schema.Types.ObjectId,
      ref: "Villa",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Pesanan = mongoose.model<IPesanan>("Pesanan", pesananSchema);
