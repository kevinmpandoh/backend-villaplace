import { Document, Schema } from "mongoose";

export interface IPembayaran extends Document {
  nama_pembayar: string;
  email_pembayar: string;
  kode_pembayaran: string;
  status_pembayaran: string;
  tanggal_pembayaran: Date;
  metode_pembayaran: string;
  bank: string;
  jumlah_pembayaran: number;
  expiry_time: Date;
  nomor_va?: string | null;
  pdf_url: string;
  pesanan: Schema.Types.ObjectId;
}
