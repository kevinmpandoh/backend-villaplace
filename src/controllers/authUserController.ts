// ???
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

//! Fungsi untuk register user (umum)
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nama, email, password, no_telepon } = req.body;

    // validasi jika user tidak mengisi field yang sudah di sediakan
    if (!nama) {
      res.status(400).json({
        status: "Failed",
        message: "Nama harus di isi!",
      });
      return;
    } else if (!email) {
      res.status(400).json({
        status: "Failed",
        message: "Email harus di isi!",
      });
      return;
    } else if (!password) {
      res.status(400).json({
        status: "Failed",
        message: "Passoword harus di isi!",
      });
      return;
    } else if (!no_telepon) {
      res.status(400).json({
        status: "Failed",
        message: "No telepon harus di isi",
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        status: "Failed",
        message: "Password harus memiliki minimal 8 karakter",
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res
        .status(400)
        .json({ status: "Failed", message: "Email sudah digunakan!" });
      return;
    }

    const existingUserNotelepon = await User.findOne({ no_telepon });
    if (existingUserNotelepon) {
      res
        .status(400)
        .json({ status: "Failed", message: "No telepon sudah digunakan!" });
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
    res.status(201).json({
      status: "Success",
      message: "User berhasil dibuat",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Fungsi login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({
        status: "Failed",
        message: "Email harus di isi!",
      });
      return;
    } else if (!password) {
      res.status(400).json({
        status: "Failed",
        message: "Passoword harus di isi!",
      });
      return;
    }
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        status: "Failed",
        message: "Email yang anda masukan salah",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        status: "Failed",
        message: "Password yang anda masukan salah!",
      });
      return;
    }
    const token = jwt.sign(
      {
        userId: user._id,
        nama: user.nama,
        email: user.email,
        no_telepon: user.no_telepon,
        foto_profile: user.foto_profile,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // res.cookie("tokenUser", token);
    res.cookie("tokenUser", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({
      status: "Success",
      message: "Berhasil login",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Fungsi logout
export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("tokenUser");
    // Menghapus token di klien
    res.json({
      status: "Success",
      message: "Logout berhasil",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout" });
  }
};
