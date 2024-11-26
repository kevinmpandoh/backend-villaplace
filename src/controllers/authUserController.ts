// ???
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

//! Fungsi untuk register user (umum)
// export const registerUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { nama, email, password, no_telepon } = req.body;

//     // validasi jika user tidak mengisi field yang sudah di sediakan
//     if (!nama) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Nama harus di isi!",
//       });
//       return;
//     } else if (!email) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Email harus di isi!",
//       });
//       return;
//     } else if (!password) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Passoword harus di isi!",
//       });
//       return;
//     } else if (!no_telepon) {
//       res.status(400).json({
//         status: "Failed",
//         message: "No telepon harus di isi",
//       });
//       return;
//     }

//     if (password.length < 8) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Password harus memiliki minimal 8 karakter",
//       });
//       return;
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       res
//         .status(400)
//         .json({ status: "Failed", message: "Email sudah digunakan!" });
//       return;
//     }

//     const existingUserNotelepon = await User.findOne({ no_telepon });
//     if (existingUserNotelepon) {
//       res
//         .status(400)
//         .json({ status: "Failed", message: "No telepon sudah digunakan!" });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       nama,
//       email,
//       password: hashedPassword,
//       no_telepon,
//     });

//     await user.save();
//     res.status(201).json({
//       status: "Success",
//       message: "User berhasil dibuat",
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ? OBJECT REGIST

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
    } else if (!email) {
      errors.email = "Email harus diisi!";
    } else if (!password) {
      errors.password = "Password harus diisi!";
    } else if (password.length < 8) {
      errors.password = "Password harus memiliki minimal 8 karakter!";
    } else if (!no_telepon) {
      errors.no_telepon = "Nomor telepon harus diisi!";
    }

    // Jika ada error, kirimkan respons
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors,
      });
      return;
    }

    // Cek apakah email sudah digunakan
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: "Failed",
        message: "Email sudah digunakan!",
        errors: { email: "Email sudah digunakan oleh user lain!" },
      });
      return;
    }

    // Cek apakah nomor telepon sudah digunakan
    const existingUserNotelepon = await User.findOne({ no_telepon });
    if (existingUserNotelepon) {
      res.status(400).json({
        status: "Failed",
        message: "Nomor telepon sudah digunakan!",
        errors: { no_telepon: "Nomor telepon sudah digunakan oleh user lain!" },
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
// export const loginUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;
//     if (!email) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Email harus di isi!",
//       });
//       return;
//     } else if (!password) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Passoword harus di isi!",
//       });
//       return;
//     }
//     const user = await User.findOne({ email });

//     if (!user) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Email yang anda masukan salah",
//       });
//       return;
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Password yang anda masukan salah!",
//       });
//       return;
//     }
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         nama: user.nama,
//         email: user.email,
//         no_telepon: user.no_telepon,
//         foto_profile: user.foto_profile,
//       },
//       JWT_SECRET,
//       {
//         expiresIn: "60s",
//       }
//     );

//     res.cookie("tokenUser", token, {
//       secure: process.env.NODE_ENV === "production",
//     });
//     res.json({
//       status: "Success",
//       message: "Berhasil login",
//       token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ? OBJECT LOGIN
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Simpan error dalam objek
    const errors: Record<string, string> = {};
    if (!email) errors.email = "Email harus diisi!";
    if (!password) errors.password = "Password harus diisi!";

    // Jika ada error, kirimkan respons dengan struktur yang diinginkan
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors,
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors: { email: "Email tidak ditemukan!" },
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors: { password: "Password yang Anda masukkan salah!" },
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

    res.cookie("tokenUser", token, {
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
