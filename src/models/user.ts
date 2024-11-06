// import mongoose, { Document, Schema } from "mongoose";
// import bcrypt from "bcryptjs";

// export interface IUser extends Document {
//   nama: string;
//   email: string;
//   password: string;
//   no_telepon: string;
//   comparePassword: (password: string) => Promise<boolean>;
// }

// const userSchema = new Schema<IUser>({
//   nama: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   no_telepon: { type: String, required: true },
// });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = function (
//   password: string
// ): Promise<boolean> {
//   return bcrypt.compare(password, this.password);
// };

// export default mongoose.model<IUser>("User", userSchema);
// ????

import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  nama: string;
  email: string;
  password: string;
  no_telepon: string;
  role: "user" | "owner" | "admin";
}

const UserSchema: Schema = new Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  no_telepon: { type: String, required: true },
  role: { type: String, enum: ["user", "owner", "admin"], default: "user" }, // Set default ke 'user'
});

export default mongoose.model<IUser>("User", UserSchema);
