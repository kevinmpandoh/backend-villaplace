import { Request, Response } from "express";
import Owner from "../models/ownerModel";
import bcrypt from "bcrypt";
import { Villa } from "../models/villaModel";

//! Get all owners
export const getAllOwners = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const owners = await Owner.find({}, "-password"); // Exclude password field
    res.json({
      status: "Success",
      data: owners,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Get an owner by ID
export const getOwnerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const owner = await Owner.findById(id, "-password"); // Exclude password field
    if (!owner) {
      res.status(404).json({ status: "Failed", message: "Owner not found" });
      return;
    }
    res.json({
      status: "Success",
      data: owner,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Update an owner by ID

export const updateOwnerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nama, email, no_telepon } = req.body;
    let updateData: any = { nama, email, no_telepon };

    // Objek untuk menyimpan error
    const errors: { [key: string]: string } = {};

    // Cek apakah email sudah digunakan oleh owner lain
    if (email) {
      const existingOwnerWithEmail = await Owner.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingOwnerWithEmail) {
        errors.email = "Email sudah digunakan oleh owner lain";
      }
    }

    // Cek apakah no_telepon sudah digunakan oleh owner lain
    if (no_telepon) {
      const existingOwnerWithPhone = await Owner.findOne({
        no_telepon,
        _id: { $ne: id },
      });
      if (existingOwnerWithPhone) {
        errors.no_telepon = "No telepon sudah digunakan oleh owner lain";
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

    // Jika tidak ada error, lanjutkan dengan update data owner
    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOwner) {
      res.status(404).json({
        status: "Failed",
        error: {
          message: "Owner tidak ditemukan",
          field: "id",
        },
      });
      return;
    }

    // Respons sukses jika update berhasil
    res.status(200).json({
      status: "Success",
      data: updatedOwner,
    });
  } catch (error) {
    console.log(error); // Untuk debugging (opsional)
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error while updating owner details",
      },
    });
  }
};

//! Delete an owner by ID
export const deleteOwnerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedOwner = await Owner.findByIdAndDelete(id);

    if (!deletedOwner) {
      res.status(404).json({
        status: "Failed",
        error: {
          message: "Owner tidak ditemukan",
          field: "id",
        },
      });
      return;
    }

    // Delete all villas owned by the owner
    await Villa.deleteMany({ pemilik_villa: id });

    res.status(200).json({
      status: "Success",
      message: "Owner successfully deleted",
    });
  } catch (error) {
    console.log(error); // Optional, for debugging purposes
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error while deleting owner",
      },
    });
  }
};

//! CURRENT OWNER
export const getOwnerCurrent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.body.owner.ownerId;
    const owner = await Owner.findById(ownerId, "-password");
    if (!owner) {
      res.status(404).json({ status: "Failed", message: "Owner not found" });
      return;
    }
    res.json({
      status: "Success",
      data: owner,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//! CHANGE PASSWORD OWNER

export const changePasswordOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Objek untuk menyimpan error
    const errors: { [key: string]: string } = {};

    // Validasi untuk password lama dan password baru
    if (!currentPassword) {
      errors.currentPassword = "Password lama harus diisi";
    }
    if (!newPassword) {
      errors.newPassword = "Password baru harus diisi";
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

    // Validasi panjang password baru
    if (newPassword.length < 8) {
      errors.newPassword = "Password baru harus memiliki minimal 8 karakter";
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({
        status: "Failed",
        message: "Validasi gagal",
        errors, // Mengirim semua error yang ditemukan dalam objek
      });
      return;
    }

    const ownerId = req.body.owner.ownerId; // Ambil ownerId dari body request
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      res.status(404).json({
        status: "Failed",
        error: {
          message: "Owner tidak ditemukan",
          field: "ownerId",
        },
      });
      return;
    }

    // Bandingkan password lama
    const isMatch = await bcrypt.compare(currentPassword, owner.password);

    if (!isMatch) {
      res.status(400).json({
        status: "Failed",
        error: {
          message: "Password yang anda masukkan salah",
          field: "currentPassword",
        },
      });
      return;
    }

    // Hash password baru dan update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    owner.password = hashedNewPassword;
    await owner.save();

    res.status(200).json({
      status: "Success",
      message: "Password berhasil diperbarui",
    });
  } catch (error) {
    console.log(error); // Untuk debugging (opsional)
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Terjadi kesalahan pada server saat mengganti password",
      },
    });
  }
};

//! UPLOAD FOTO PROFILE OWNER
export const uploadProfileImagesOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.params.id;

    if (!req.file) {
      res.status(400).json({
        status: "Failed",
        message: "Upload foto profile anda!",
      });
      return;
    }

    const foto_profile = req.file?.filename;

    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      { foto_profile },
      { new: true }
    );

    if (!updatedOwner) {
      res.status(404).json({
        status: "Failed",
        message: "Owner not found",
      });
      return;
    }

    res.json({
      status: "Success",
      message: "Profile image updated successfully",
      data: updatedOwner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "Failed",
      message: "Server error while updating profile image",
    });
  }
};
