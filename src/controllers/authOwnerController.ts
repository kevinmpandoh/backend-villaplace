import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Owner from "../models/ownerModel";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

//! Fungsi untuk register owner
// export const registerOwner = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { nama, email, password, no_telepon } = req.body;
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
//         message: "Password harus di isi!",
//       });
//       return;
//     } else if (!no_telepon) {
//       res.status(400).json({
//         status: "Failed",
//         message: "No telepon harus di isi!",
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
//     const existingOwner = await Owner.findOne({ email });
//     if (existingOwner) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Email sudah digunakan!",
//       });
//       return;
//     }
//     const existingOwnerNotelepon = await Owner.findOne({ no_telepon });
//     if (existingOwnerNotelepon) {
//       res.status(400).json({
//         status: "Failed",
//         message: "No telepon sudah digunakan!",
//       });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const owner = new Owner({
//       nama,
//       email,
//       password: hashedPassword,
//       no_telepon,
//     });

//     await owner.save();
//     res.status(201).json({
//       status: "Success",
//       message: "Owner berhasil dibuat",
//       data: owner,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
//? OBJECT
export const registerOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { nama, email, password, no_telepon } = req.body;
    const errors: { [key: string]: string } = {};

    // Validasi field
    if (!nama) {
      errors.nama = "Nama harus diisi!";
    } else if (!email) {
      errors.email = "Email harus diisi!";
    } else if (!password) {
      errors.password = "Password harus diisi!";
    } else if (password.length < 8) {
      errors.password = "Password harus memiliki minimal 8 karakter!";
    } else {
      // Validasi terakhir untuk no_telepon
      if (!no_telepon) {
        errors.no_telepon = "Nomor telepon harus diisi!";
      }
    }

    // Jika ada error, kirim respons dengan format error sebagai object
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors,
      });
      return;
    }

    // Cek apakah email sudah digunakan
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      res.status(400).json({
        status: "Failed",
        message: "Email sudah digunakan!",
        errors: { email: "Email sudah digunakan!" },
      });
      return;
    }

    // Cek apakah nomor telepon sudah digunakan
    const existingOwnerNotelepon = await Owner.findOne({ no_telepon });
    if (existingOwnerNotelepon) {
      res.status(400).json({
        status: "Failed",
        message: "Nomor telepon sudah digunakan!",
        errors: { no_telepon: "Nomor telepon sudah digunakan!" },
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
      message: "Server error",
      errors: { server: "Terjadi kesalahan pada server!" },
    });
  }
};

//! MEMBUAT MENU LOGIN OWNER!
// export const loginOwner = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
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
//         message: "Password harus di isi!",
//       });
//       return;
//     }
//     const owner = await Owner.findOne({ email });
//     if (!owner) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Email yang anda masukan salah",
//       });
//       return;
//     }

//     const isPasswordValid = await bcrypt.compare(password, owner.password);

//     if (!isPasswordValid) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Password yang anda masukan salah",
//       });
//       return;
//     }

//     const token = jwt.sign(
//       {
//         ownerId: owner._id,
//         nama: owner.nama,
//         email: owner.email,
//         no_telepon: owner.no_telepon,
//         foto_profile: owner.foto_profile,
//       },
//       JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.cookie("tokenOwner", token, {
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
//? OBJECT LOGIN
export const loginOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const errors: { [key: string]: string } = {};

    // Validasi field
    if (!email) {
      errors.email = "Email harus diisi!";
    }
    if (!password) {
      errors.password = "Password harus diisi!";
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

    // Cek apakah email terdaftar
    const owner = await Owner.findOne({ email });
    if (!owner) {
      res.status(400).json({
        status: "Failed",
        message: "Email yang anda masukan salah",
        errors: { email: "Email yang anda masukan salah" },
      });
      return;
    }

    // Cek apakah password valid
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      res.status(400).json({
        status: "Failed",
        message: "Password yang anda masukan salah",
        errors: { password: "Password yang anda masukan salah" },
      });
      return;
    }

    // Membuat token JWT
    const token = jwt.sign(
      {
        ownerId: owner._id,
        nama: owner.nama,
        email: owner.email,
        no_telepon: owner.no_telepon,
        foto_profile: owner.foto_profile,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set cookie dengan token
    res.cookie("tokenOwner", token, {
      secure: process.env.NODE_ENV === "production",
    });

    // Respons sukses
    res.json({
      status: "Success",
      message: "Berhasil login",
      data: {
        token,
      },
    });
  } catch (error) {
    // Respons error server
    res.status(500).json({
      status: "Failed",
      message: "Server error",
      errors: { server: "Terjadi kesalahan pada server!" },
    });
  }
};

//! LOGOUT OWNER

export const logoutOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Menghapus token di klien
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
