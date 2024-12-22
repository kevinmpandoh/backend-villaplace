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

    const errors: Record<string, string> = {};

    // Validasi field
    if (!nama) {
      errors.nama = "Nama harus diisi!";
    }
    if (!email) {
      errors.email = "Email harus diisi!";
    }
    if (!password) {
      errors.password = "Password harus diisi!";
    } else if (password.length < 8) {
      errors.password = "Password harus memiliki minimal 8 karakter!";
    }
    if (!no_telepon) {
      errors.no_telepon = "Nomor telepon harus diisi!";
    }

    // Validasi untuk email dan nomor telepon di database
    if (email) {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        errors.email = "Email sudah digunakan oleh user lain!";
      }
    }

    if (no_telepon) {
      const existingUserByPhone = await User.findOne({ no_telepon });
      if (existingUserByPhone) {
        errors.no_telepon = "Nomor telepon sudah digunakan oleh user lain!";
      }
    }

    // Jika ada error, kirimkan semua kesalahan sekaligus
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors,
      });
      return;
    }

    // Proses hashing password dan penyimpanan user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      nama,
      email,
      password: hashedPassword,
      no_telepon,
    });

    await user.save();

    // Respons sukses
    res.status(201).json({
      status: "Success",
      message: "User berhasil dibuat",
      data: user,
    });
  } catch (error) {
    // Respons untuk error server
    res.status(500).json({
      status: "Failed",
      message: "Terjadi kesalahan pada server",
      errors: { server: "Internal server error" },
    });
  }
};

//! Fungsi login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Simpan semua error dalam objek
    const errors: Record<string, string> = {};

    // Validasi email
    if (!email) {
      errors.email = "Email harus diisi!";
    } else {
      const user = await User.findOne({ email });

      if (!user) {
        errors.email = "Email tidak ditemukan!";
      }
    }

    // Validasi password
    if (!password) {
      errors.password = "Password harus diisi!";
    } else {
      // Periksa user hanya jika user ditemukan
      const user = await User.findOne({ email });
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          errors.password = "Password yang Anda masukkan salah!";
        }
      }
    }

    // Jika ada error, kirimkan respons dengan semua error
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors,
      });
      return;
    }

    // Validasi berhasil, buat token JWT
    const user = await User.findOne({ email });
    if (!user) {
      res.status(500).json({
        status: "Failed",
        message: "Terjadi kesalahan pada server",
        errors: { server: "User tidak ditemukan setelah validasi!" },
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
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Cookie hanya dapat diakses melalui server
      secure: true, // Hanya gunakan HTTPS
      sameSite: "none", // Izinkan lintas domain
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    res.json({
      status: "Success",
      message: "Berhasil login",
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Terjadi error pada server",
      errors: { server: "Error pada server" },
    });
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
    res.status(500).json({
      status: "Failed",
      message: "Server error during logout",
      errors: {
        server: "Terjadi kesalahan pada server saat logout",
      },
    });
  }
};
