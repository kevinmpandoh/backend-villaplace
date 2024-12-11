import { Request, Response } from "express";
import { Ulasan } from "../models/Ulasan";
import { Villa } from "../models/villaModel";

const UlasanController = {
  getAllUlasan: async (req: Request, res: Response) => {
    try {
      const ulasanList = await Ulasan.find()
        .populate("user")
        .populate("villa")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: "success",
        message: "Success get all ulasan",
        data: ulasanList,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  getAllUlasanByOwner: async (req: Request, res: Response) => {
    try {
      const ownerId = req.body.owner.ownerId;

      if (!ownerId) {
        return res.status(400).json({
          status: "error",
          message: "Owner ID is required",
        });
      }

      const villas = await Villa.find({ pemilik_villa: ownerId }).select("_id");

      if (!villas.length) {
        return res.status(404).json({
          status: "error",
          message: "No villas found for this owner",
        });
      }

      const villaIds = villas.map((villa) => villa._id);

      // Find all ulasan (reviews) related to the found villas
      const ulasanList = await Ulasan.find({ villa: { $in: villaIds } })
        .populate("user")
        .populate("villa")
        .sort({ createdAt: -1 });

      if (ulasanList.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No ulasan found for this owner's villas",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Successfully retrieved ulasan by owner",
        data: ulasanList,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: "An error occurred while retrieving ulasan",
        error: error.message,
      });
    }
  },

  getUlasanByIdUser: async (req: Request, res: Response) => {
    try {
      const user = req.body.userLogin.userId;

      // cari villa berdasarkan user dan villa nya
      const ulasan = await Ulasan.find({ user });
      if (!ulasan) {
        return res.status(404).json({
          status: "error",
          message: "Ulasan not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Success get ulasan by villa id",
        data: ulasan,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  createUlasan: async (req: Request, res: Response) => {
    try {
      const userId = req.body.userLogin.userId;
      const { komentar, rating, villa, pesanan } = req.body;

      // Check if villa ID is provided
      if (!villa) {
        return res.status(400).json({
          status: "error",
          message: "Villa ID is required.",
        });
      }

      // Check if user ID is provided
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is required.",
        });
      }

      if (!pesanan) {
        return res.status(400).json({
          status: "error",
          message: "Pesanan ID is required.",
        });
      }

      // Check if the villa exists in the database
      const existingVilla = await Villa.findById(villa);
      if (!existingVilla) {
        return res.status(404).json({
          status: "error",
          message: "Villa not found.",
        });
      }

      // Create a new ulasan (review)
      const newUlasan = new Ulasan({
        komentar,
        rating,
        user: userId,
        villa: villa,
        pesanan: pesanan,
      });

      // Update the villa with the new ulasan
      await Villa.findByIdAndUpdate(
        villa,
        { $push: { ulasan: newUlasan._id } },
        { new: true }
      );

      // Save the new ulasan
      await newUlasan.save();

      return res.status(201).json({
        status: "success",
        message: "Successfully added new ulasan",
        data: newUlasan,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
  getUlasanById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ulasan = await Ulasan.findById(id)
        .populate("villa")
        .populate("user");
      if (!ulasan) {
        return res.status(404).json({
          status: "error",
          message: "Ulasan not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Success get ulasan by id",
        data: ulasan,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  updateUlasanById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { komentar, rating } = req.body;
      const updatedUlasan = await Ulasan.findByIdAndUpdate(
        id,
        { komentar, rating },
        { new: true, runValidators: true }
      );
      if (!updatedUlasan) {
        return res.status(404).json({
          status: "error",
          message: "Ulasan not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Success update ulasan by id",
        data: updatedUlasan,
      });
    } catch (error: any) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  deleteUlasanByUser: async (req: Request, res: Response) => {
    try {
      const userId = req.body.userLogin.userId;
      const { id } = req.params;

      const ulasan = await Ulasan.findById(id);
      if (!ulasan) {
        return res.status(404).json({
          status: "error",
          message: "Ulasan not found",
        });
      }
      if (ulasan.user.toString() !== userId) {
        return res.status(403).json({
          status: "error",
          message: "You do not have permission to delete this ulasan",
        });
      }
      const deletedUlasan = await Ulasan.findByIdAndDelete(id);
      if (!deletedUlasan) {
        return res.status(404).json({
          status: "error",
          message: "Ulasan not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Success delete ulasan by id",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },

  deleteUlasan: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const ulasan = await Ulasan.findById(id);
      if (!ulasan) {
        return res.status(404).json({
          status: "error",
          message: "Ulasan not found",
        });
      }
      const deletedUlasan = await Ulasan.findByIdAndDelete(id);
      if (!deletedUlasan) {
        return res.status(404).json({
          status: "error",
          message: "Ulasan not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Success delete ulasan by id",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = UlasanController;
