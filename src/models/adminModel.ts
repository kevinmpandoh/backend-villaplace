import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IAdmin } from "../types/admin";

const adminSchema = new Schema<IAdmin>(
  {
    nama: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    foto_profile: { type: String, default: "default_PP.png" },
  },
  {
    timestamps: true,
  }
);


export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
