import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IOwner extends Document {
  nama: string;
  email: string;
  password: string;
  no_telepon: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const ownerSchema = new Schema<IOwner>({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  no_telepon: { type: String, required: true },
});

ownerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

ownerSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IOwner>("Owner", ownerSchema);
