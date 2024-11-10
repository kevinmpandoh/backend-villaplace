import { Request, Response } from "express";
import { Pesanan } from "../models/pesananModel";

const PesananController = {
  getAllPesanan: async (req: Request, res: Response): Promise<any> => {
    try {
      const pesanan = await Pesanan.find()
        .populate({
          path: "villa",
          populate: [
            {
              path: "pemilik_villa",
              model: "User",
            },
          ],
        })
        .populate("user");
      return res.status(200).json({
        status: "success",
        message: "Success get all pesanan",
        data: pesanan,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  getPesananById: async (req: Request, res: Response): Promise<any> => {
    try {
      const pesanan = await Pesanan.findById(req.params.id).populate([
        {
          path: "villa",
          populate: [
            {
              path: "pemilik_villa",
              model: "User",
            },
          ],
        },
        "user",
      ]);

      if (!pesanan) {
        return res.status(404).json({
          status: "error",
          message: "Pesanan not found",
        });
      }
      res.status(200).json({
        status: "success",
        message: "Success get pesanan by id",
        data: pesanan,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  createPesanan: async (req: Request, res: Response) => {
    try {
      const { villa, tanggal_mulai, tanggal_selesai } = req.body;

      // Convert tanggal_mulai and tanggal_selesai to Date objects
      const startDate = new Date(tanggal_mulai);
      const endDate = new Date(tanggal_selesai);

      // Check if there are overlapping bookings for the same Villa
      const existingBookings = await Pesanan.find({
        villa,
        $or: [
          {
            tanggal_mulai: { $lt: endDate },
            tanggal_selesai: { $gt: startDate },
          },
          { tanggal_mulai: { $gte: startDate, $lte: endDate } },
          { tanggal_selesai: { $gte: startDate, $lte: endDate } },
        ],
      });

      if (existingBookings.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Villa is already booked for the selected dates",
        });
      }
      const newPesanan = new Pesanan(req.body);
      const savedPesanan = await newPesanan.save();

      return res.status(201).json({
        status: "success",
        message: "Pesanan created successfully",
        data: savedPesanan,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  updatePesanan: async (req: Request, res: Response) => {
    try {
      const updatedPesanan = await Pesanan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedPesanan) {
        return res.status(404).json({
          status: "error",
          message: "Pesanan not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Pesanan updated successfully",
        data: updatedPesanan,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  deletePesanan: async (req: Request, res: Response) => {
    try {
      const deletedPesanan = await Pesanan.findByIdAndDelete(req.params.id);
      if (!deletedPesanan) {
        return res.status(404).json({ message: "Pesanan not found" });
      }
      res.status(200).json({
        status: "success",
        message: "Success delete pesanan by id",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
};

module.exports = PesananController;
