import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../models/admin";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      res
        .status(400)
        .json({ status: "failed", message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ userId: admin._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    // res.cookie("tokenUser", token);
    res.cookie("tokenAdmin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! LOG OUT ADMIN
export const logoutAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("tokenAdmin");
    // Menghapus token di klien
    res.json({
      message: "Logout successful. Please remove your token on client-side.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout" });
  }
};
