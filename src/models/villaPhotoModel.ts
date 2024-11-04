import mongoose, { Schema, Document } from "mongoose";
import { IVillaPhoto } from "../types/VillaPhoto";

const villaPhotoSchema: Schema = new Schema({
  villa: {
    type: Schema.Types.ObjectId,
    ref: "Villa", // Referensi ke koleksi Villa
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
});

export const VillaPhoto = mongoose.model<IVillaPhoto>(
  "VillaPhoto",
  villaPhotoSchema
);
