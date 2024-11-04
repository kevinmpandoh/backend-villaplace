import { Schema, Document } from "mongoose";

export interface IVillaPhoto extends Document {
  nama: string;
  url: string;
  villa: Schema.Types.ObjectId;
  filepath: string;
}
