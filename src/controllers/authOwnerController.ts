import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Owner from "../models/ownerModel";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

//! Fungsi untuk register owner
export const registerOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nama, email, password, no_telepon } = req.body;
    const errors: { [key: string]: string } = {};

    // Validasi nama
    if (!nama) {
      errors.nama = "Nama harus diisi!";
    }

    // Validasi email
    if (!email) {
      errors.email = "Email harus diisi!";
    } else {
      const existingOwner = await Owner.findOne({ email });
      if (existingOwner) {
        errors.email = "Email sudah digunakan oleh owner lain!";
      }
    }

    // Validasi password
    if (!password) {
      errors.password = "Password harus diisi!";
    } else if (password.length < 8) {
      errors.password = "Password harus memiliki minimal 8 karakter!";
    }

    // Validasi nomor telepon
    if (!no_telepon) {
      errors.no_telepon = "Nomor telepon harus diisi!";
    } else {
      const existingOwnerPhone = await Owner.findOne({ no_telepon });
      if (existingOwnerPhone) {
        errors.no_telepon = "Nomor telepon sudah digunakan oleh owner lain!";
      }
    }

    // Jika ada error, kirim respons dengan format error sebagai objek
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors,
      });
      return;
    }

    // Hash password dan simpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);
    const owner = new Owner({
      nama,
      email,
      password: hashedPassword,
      no_telepon,
    });

    await owner.save();

    // Respons sukses
    res.status(201).json({
      status: "Success",
      message: "Owner berhasil dibuat",
      data: owner,
    });
  } catch (error) {
    // Respons error server
    res.status(500).json({
      status: "Failed",
      message: "Terjadi kesalahan pada server!",
      errors: { server: "Terjadi kesalahan pada server!" },
    });
  }
};

//! MEMBUAT MENU LOGIN OWNER!
export const loginOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Simpan semua error dalam objek
    const errors: Record<string, string> = {};

    // Validasi email
    if (!email) {
      errors.email = "Email harus diisi!";
    } else {
      const owner = await Owner.findOne({ email });

      if (!owner) {
        errors.email = "Email tidak ditemukan!";
      }
    }

    // Validasi password
    if (!password) {
      errors.password = "Password harus diisi!";
    } else {
      // Periksa owner hanya jika owner ditemukan
      const owner = await Owner.findOne({ email });
      if (owner) {
        const isPasswordValid = await bcrypt.compare(password, owner.password);
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
    const owner = await Owner.findOne({ email });
    if (!owner) {
      res.status(500).json({
        status: "Failed",
        message: "Terjadi kesalahan pada server",
        errors: { server: "Owner tidak ditemukan setelah validasi!" },
      });
      return;
    }

    const token = jwt.sign(
      {
        ownerId: owner._id,
        nama: owner.nama,
        email: owner.email,
        no_telepon: owner.no_telepon,
        foto_profile: owner.foto_profile,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("tokenOwner", token, {
      secure: process.env.NODE_ENV === "production",
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

//! LOGOUT OWNER

export const logoutOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("tokenOwner");
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
