import { Schema, model } from "mongoose";

interface IPesanan {
  harga: number;
  jumlah_orang: number;
  nama_pembayar: string;
  email_pembayar: string;
  catatan: string;
  status: string;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  user: Schema.Types.ObjectId;
  villa: Schema.Types.ObjectId;
}

const pesananSchema = new Schema<IPesanan>(
  {
    harga: {
      type: Number,
      required: true,
    },
    jumlah_orang: {
      type: Number,
      required: true,
    },
    nama_pembayar: {
      type: String,
      required: true,
    },
    email_pembayar: {
      type: String,
      required: true,
    },
    catatan: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    tanggal_mulai: {
      type: Date,
      required: true,
    },
    tanggal_selesai: {
      type: Date,
      required: true,
    },
    villa: {
      type: Schema.Types.ObjectId,
      ref: "Villa",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Pesanan = model("Pesanan", pesananSchema);
