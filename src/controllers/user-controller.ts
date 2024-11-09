import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
// import user from "../models/user";
const JWT_SECRET = process.env.JWT_SECRET;

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
      res.status(404).json({ status: "Failed", message: "User not found" });
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

    const { nama, email, no_telepon } = req.body;
    let updateData: any = { nama, email, no_telepon };

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).json({ status: "Failed", message: "User not found" });
      return;
    }
    res.json({
      status: "Success",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
      res.status(404).json({ status: "Failed", message: "User not found" });
      return;
    }
    res.json({
      status: "Success",
      message: "User successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    console.log(req.body);
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
    const userId = req.body.userLogin.userId; // Ambil userId dari userLogin di req.body
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ status: "Failed", message: "User not found" });
      return;
    }

    // Compare the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("Entered password:", currentPassword);
    console.log("Stored hashed password:", user.password);

    if (!isMatch) {
      res
        .status(400)
        .json({ status: "Failed", message: "Incorrect current password" });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      status: "Success",
      message: "Password successfully updated",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ?

//! UPLOAD IMAGE PROFILE
export const uploadProfileImagesUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    // const userId = req.body.userLogin.userId; // Ambil userId dari userLogin di req.body
    const foto_profile = req.file?.filename;
    console.log(foto_profile);
    let updateData: any = { foto_profile };
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    console.log(updatedUser);
    res.json({
      status: "Success",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Failed to upload user images",
    });
  }
};
