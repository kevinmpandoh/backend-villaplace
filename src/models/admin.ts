import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IAdmin } from "../types/admin";

const adminSchema = new Schema<IAdmin>({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  no_telepon: { type: String, required: true },
});

export default mongoose.model<IAdmin>("Admin", adminSchema);
