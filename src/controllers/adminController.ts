import { Request, Response } from "express";
import { Admin } from "../models/adminModel";
import bcrypt from "bcrypt";

const adminController = {
  getAllAdmins: async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchQuery } = req.query; // Get the search query from request
  
      let query = {}; // Default query to return all admins
  
      if (searchQuery) {
        // If searchQuery exists, filter the admins based on the search term
        query = {
          $or: [
            { username: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for username
            { email: { $regex: searchQuery, $options: "i" } },
          ],
        };
      }
  
      // Fetch admins with the query filter
      const admins = await Admin.find(query, "-password"); // Exclude password field
  
      res.json({
        status: "Success",
        message: "Successfully retrieved admins",
        data: admins,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  getAdminById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id, "-password");

      if (!admin) {
        res.status(404).json({
          status: "error",
          message: "Admin not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Success get admin by id",
        data: admin,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  createAdmin: async (req: Request, res: Response) => {
    try {
      const { nama, email, password } = req.body;
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({
          status: "error",
          message: "Admin with this email already exists",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        nama,
        email,
        password: hashedPassword,
      });

      const savedAdmin = await newAdmin.save();

      return res.status(201).json({
        status: "success",
        message: "Admin created successfully",
        data: savedAdmin,
      });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Internal Server Error",
      });
    }
  },

  updateAdminById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { nama, email } = req.body;
      const updateData: any = { nama, email };
  
      const emailExists = await Admin.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        res.status(400).json({
          status: "error",
          message: "Email already exists for another admin",
        });
        return;
      }
  
      const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (!updatedAdmin) {
        res.status(404).json({
          status: "error",
          message: "Admin not found",
        });
        return;
      }
  
      res.status(200).json({
        status: "success",
        message: "Success update admin by id",
        data: updatedAdmin,
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  

  deleteAdminById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedAdmin = await Admin.findByIdAndDelete(id);
      if (!deletedAdmin) {
        res.status(404).json({
          status: "error",
          message: "Admin not found",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Success delete admin by id",
      });
    } catch (error: any) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  getAdminCurrent: async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = req.body.admin.adminId;
      const admin = await Admin.findById(adminId, "-password");
      if (!admin) {
        res.status(404).json({ status: "Failed", message: "Admin not found" });
        return;
      }
      res.json({
        status: "Success",
        data: admin,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  changePasswordAdmin: async (req: Request, res: Response): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (newPassword.length < 8) {
        res.status(400).json({
          status: "Failed",
          message: "Password harus memiliki minimal 8 karakter",
        });
        return;
      }
      const adminId = req.body.admin.adminId;
      const admin = await Admin.findById(adminId);

      if (!admin) {
        res.status(404).json({ status: "Failed", message: "Owner not found" });
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, admin.password);

      if (!isMatch) {
        res
          .status(400)
          .json({ status: "Failed", message: "Incorrect current password" });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedNewPassword;
      await admin.save();

      res.status(200).json({
        status: "Success",
        message: "Password successfully updated",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminController;
