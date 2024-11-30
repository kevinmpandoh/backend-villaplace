import { Document, Schema } from "mongoose";

export interface IPesanan extends Document {
  harga: number;
  jumlah_orang: number;
  catatan: string;
  status: string;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  user: Schema.Types.ObjectId;
  villa: Schema.Types.ObjectId;
}
