import { Document, Schema } from "mongoose";

export interface IPembayaran extends Document {
  kode_pembayaran: string;
  status_pembayaran: string;
  tanggal_pembayaran: Date;
  metode_pembayaran: string;
  jumlah_pembayaran: number;
  nomor_va?: string | null;
  cara_pembayaran: string;
  pesanan: Schema.Types.ObjectId;
}
