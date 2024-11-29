import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { Ulasan } from "../models/Ulasan";
import { Pesanan } from "../models/pesananModel";

//! Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({}, "-password"); // Exclude password field
    res.json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id, "-password"); // Exclude password field

    if (!user) {
      res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
      return;
    }
    res.json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Update a user by ID

export const updateUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, no_telepon } = req.body;

    // Objek untuk menyimpan error
    const errors: { [key: string]: string } = {};

    // Cek apakah email sudah digunakan oleh user lain
    if (email) {
      const existingUserWithEmail = await User.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingUserWithEmail) {
        errors.email = "Email sudah digunakan oleh user lain";
      }
    }

    // Cek apakah no_telepon sudah digunakan oleh user lain
    if (no_telepon) {
      const existingUserWithPhone = await User.findOne({
        no_telepon,
        _id: { $ne: id },
      });
      if (existingUserWithPhone) {
        errors.no_telepon = "No telepon sudah digunakan oleh user lain";
      }
    }

    // Jika ada error, kirimkan semua error dalam satu response
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors, // Mengirim semua error yang ditemukan dalam objek
      });
      return;
    }

    // Jika tidak ada error, lanjutkan dengan update data user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, no_telepon },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        status: "Failed",
        message: "User tidak ditemukan",
        errors: { id: "User tidak ditemukan" },
      });
      return;
    }

    // Respons sukses jika update berhasil
    res.json({
      status: "Success",
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Terjadi kesalahan pada server",
      errors: { server: "Terjadi kesalahan pada server!" },
    });
  }
};

//! Delete a user by ID
export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      // Send error message using an object for easier frontend handling
      res.status(404).json({
        status: "Failed",
        error: {
          message: "User not found",
          field: "id",
        },
      });
      return;
    }

    //! Delete all reviews and orders related to the user
    await Ulasan.deleteMany({ user: id });
    await Pesanan.deleteMany({ user: id });

    res.json({
      status: "Success",
      message: "User successfully deleted",
    });
  } catch (error) {
    // Simplified error message in the catch block
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error during deletion",
      },
    });
  }
};

//! USER CURRENT
export const getUserCurrent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.body.userLogin.userId;
    const user = await User.findById(userId, "-password"); // Exclude password field
    if (!user) {
      res.status(404).json({ status: "Failed", message: "User not found" });
      return;
    }
    res.json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//! CHANGE PASSWORD
export const changePasswordUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Objek untuk menyimpan error
    const errors: { [key: string]: string } = {};

    // Validasi password lama dan baru
    if (!currentPassword) {
      errors.currentPassword = "Password lama harus diisi!";
    }

    if (!newPassword) {
      errors.newPassword = "Password baru harus diisi";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password baru harus memiliki minimal 8 karakter!";
    }

    // Jika ada error, kirimkan semua error dalam satu response
    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors,
      });
      return;
    }

    const userId = req.body.userLogin.userId; // Ambil userId dari userLogin di req.body
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        status: "Failed",
        error: {
          message: "User not found",
          field: "userId",
        },
      });
      return;
    }

    // Compare the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({
        status: "Failed",
        error: {
          message: "Password yang anda masukan salah",
          field: "currentPassword",
        },
      });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      status: "Success",
      data: {
        message: "Password successfully updated",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error while changing password",
      },
    });
  }
};

//! UPLOAD IMAGE PROFILE
export const uploadProfileImagesUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const foto_profile = req.file?.filename;

    if (!foto_profile) {
      res.status(400).json({
        status: "Failed",
        error: {
          message: "Upload foto profile anda!",
          field: "foto_profile",
        },
      });
      return;
    }

    let updateData: any = { foto_profile };
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({
        status: "Failed",
        error: {
          message: "User not found",
          field: "userId",
        },
      });
      return;
    }

    res.status(200).json({
      status: "Success",
      data: {
        message: "Profile image uploaded successfully",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error while uploading the profile image",
      },
    });
  }
};
