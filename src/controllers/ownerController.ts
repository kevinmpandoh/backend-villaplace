import { Request, Response } from "express";
import Owner from "../models/ownerModel";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET;
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

    // Update profile picture if provided
    if (req.file && req.file.path) {
      updateData.foto_profile = req.file.path; // Assuming file upload middleware is used
    }

    const updatedOwner = await Owner.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedOwner) {
      res.status(404).json({ status: "Failed", message: "Owner not found" });
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
      res.status(404).json({ status: "Failed", message: "Owner not found" });
      return;
    }
    res.json({
      status: "Success",
      message: "Owner successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! CHANGE PASSWORD OWNER

export const changePasswordOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const ownerId = req.body.ownerLogin.ownerId; // Ambil userId dari userLogin di req.body
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      res.status(404).json({ status: "Failed", message: "Owner not found" });
      return;
    }

    // Compare the current password
    const isMatch = await bcrypt.compare(currentPassword, owner.password);
    console.log("Entered password:", currentPassword);
    console.log("Stored hashed password:", owner.password);

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
    // const ownerId = req.body.ownerLogin.ownerId; // Ambil userId dari userLogin di req.body
    console.log(ownerId);
    const foto_profile = req.file?.filename;
    console.log(foto_profile);
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
