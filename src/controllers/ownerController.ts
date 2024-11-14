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

    //! Cek apakah email, no_telepon, atau nama sudah digunakan oleh owner lain
    const existingOwnerWithEmail =
      email && (await Owner.findOne({ email, _id: { $ne: id } }));
    const existingOwnerWithPhone =
      no_telepon && (await Owner.findOne({ no_telepon, _id: { $ne: id } }));
    const existingOwnerWithName =
      nama && (await Owner.findOne({ nama, _id: { $ne: id } }));

    if (existingOwnerWithEmail) {
      res.status(400).json({
        status: "Failed",
        message: "Email sudah digunakan oleh owner lain",
      });
      return;
    } else if (existingOwnerWithPhone) {
      res.status(400).json({
        status: "Failed",
        message: "No telepon sudah digunakan oleh owner lain",
      });
      return;
    } else if (existingOwnerWithName) {
      res.status(400).json({
        status: "Failed",
        message: "Nama sudah digunakan oleh owner lain",
      });
      return;
    }
    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedOwner) {
      res.status(404).json({
        status: "Failed",
        message: "Owner tidak ditemukan",
      });
      return;
    }
    res.json({
      status: "Success",
      data: updatedOwner,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
        message: "Owner tidak ditemukan",
      });
      return;
    }

    // Delete all villas owned by the owner
    await Villa.deleteMany({ pemilik_villa: id });

    res.json({
      status: "Success",
      message: "Owner successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    // Validasi panjang password
    if (newPassword.length < 8) {
      res.status(400).json({
        status: "Failed",
        message: "Password harus memiliki minimal 8 karakter",
      });
      return;
    }
    const ownerId = req.body.owner.ownerId; // Ambil userId dari userLogin di req.body
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      res.status(404).json({ status: "Failed", message: "Owner not found" });
      return;
    }

    // Compare the current password
    const isMatch = await bcrypt.compare(currentPassword, owner.password);

    if (!isMatch) {
      res
        .status(400)
        .json({ status: "Failed", message: "Incorrect current password" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    owner.password = hashedNewPassword;
    await owner.save();

    res.status(200).json({
      status: "Success",
      message: "Password successfully updated",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! UPLOAD FOTO PROFILE OWNER
export const uploadProfileImagesOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.id;
    const foto_profile = req.file?.filename;
    let updateData: any = { foto_profile };
    const updatedOwner = await Owner.findByIdAndUpdate(ownerId, updateData, {
      new: true,
    });

    res.json({
      status: "Success",
      data: updatedOwner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Failed to upload owner images",
    });
  }
};
