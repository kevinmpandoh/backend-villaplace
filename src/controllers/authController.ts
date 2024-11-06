// ???
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";
import Owner from "../models/owner";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Fungsi untuk register user (umum)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama, email, password, no_telepon } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      nama,
      email,
      password: hashedPassword,
      no_telepon,
    });

    await user.save();
    res.status(201).json({ message: "User registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Fungsi untuk register owner
export const registerOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nama, email, password, no_telepon } = req.body;

    const existingUser = await Owner.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = new Owner({
      nama,
      email,
      password: hashedPassword,
      no_telepon,
    });

    await owner.save();
    res.status(201).json({ message: "Owner registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    console.log(req.body.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    // res.cookie("tokenUser", token);
    res.cookie("tokenUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
//! MEMBUAT MENU LOGIN ADMIN, OWNER!
// export const loginOwner = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     const owner = await Owner.findOne({ email });
//     if (!owner) {
//       res.status(400).json({ message: "Invalid credentials" });
//       return;
//     }

//     const isPasswordValid = await bcrypt.compare(password, owner.password);

//     if (!isPasswordValid) {
//       res.status(400).json({ message: "Invalid credentials" });
//       return;
//     }

//     const token = jwt.sign({ userId: owner._id }, JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     // res.cookie("tokenUser", token);
//     res.cookie("tokenUser", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//     });
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// Fungsi logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("tokenUser");
    // Menghapus token di klien
    res.json({
      message: "Logout successful. Please remove your token on client-side.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout" });
  }
};
