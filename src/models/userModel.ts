// ????

import { IUser } from "../types/user";
import mongoose, { Schema, Document } from "mongoose";
const UserSchema: Schema = new Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  no_telepon: { type: String, required: true },
  foto_profile: {
    type: String,
    default: "/assets/img/default_avatar/PP_MALE.png",
  },
},
{
  timestamps: true,
});

export default mongoose.model<IUser>("User", UserSchema);
