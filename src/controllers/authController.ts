// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import User from "../models/user";
// import Owner from "../models/owner";
// import Admin from "../models/admin";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { nama, email, password, no_telepon, role } = req.body;

//     const Model = role === "owner" ? Owner : role === "admin" ? Admin : User;

//     const existingUser = await Model.findOne({ email });
//     if (existingUser) {
//       res.status(400).json({ message: "Email already in use" });
//       return;
//     }

//     const user = new Model({ nama, email, password, no_telepon });
//     await user.save();
//     res.status(201).json({ message: "Registration successful" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password, role } = req.body;

//     const Model = role === "owner" ? Owner : role === "admin" ? Admin : User;

//     const user = await Model.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//       res.status(400).json({ message: "Invalid credentials" });
//       return;
//     }

//     const token = jwt.sign({ userId: user._id, role }, JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const test = async (req: Request, res: Response): Promise<void> => {
//   res.send("Hello");
// };
// ???
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user";

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
      role: "user",
    });

    await user.save();
    res.status(201).json({ message: "User registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Fungsi untuk register owner
export const registerOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nama, email, password, no_telepon } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = new User({
      nama,
      email,
      password: hashedPassword,
      no_telepon,
      role: "owner",
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

// Fungsi logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token");
    // Menghapus token di klien
    res.json({
      message: "Logout successful. Please remove your token on client-side.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout" });
  }
};
