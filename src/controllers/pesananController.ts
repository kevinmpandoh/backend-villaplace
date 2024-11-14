import { Request, Response } from "express";
import { Pesanan } from "../models/pesananModel";
import { Villa } from "../models/villaModel";
import { Pembayaran } from "../models/pembayaranModel";

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

  createPesanan: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        villa,
        tanggal_mulai,
        tanggal_selesai,
        harga,
        jumlah_orang,
        nama_pembayar,
        email_pembayar,
        catatan,
      } = req.body;

      const userId = req.body.userLogin?.userId;

      // Validasi manual untuk memastikan semua field wajib diisi
      const errors = [];
      if (!villa) errors.push({ villa_id: "Villa ID is required" });
      if (!tanggal_mulai)
        errors.push({ tanggal_masuk: "Tanggal Masuk is required" });
      if (!tanggal_selesai)
        errors.push({ tanggal_selesai: "Tanggal selesai is required" });
      if (!jumlah_orang)
        errors.push({ jumlah_orang: "Jumlah Orang is required" });
      if (!harga) errors.push({ total_harga: "Total Harga is required" });
      if (!nama_pembayar)
        errors.push({ nama_pembayaran: "Nama Pembayaran is required" });
      if (!email_pembayar)
        errors.push({ email_pembayaran: "Email Pembayaran is required" });
      if (!userId) errors.push({ id_pengguna: "ID Pengguna is required" });

      // Jika ada error, kirim respons 400 dengan daftar error
      if (errors.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Bad request",
          errors,
        });
      }

      const villaExist = await Villa.findById(villa);
      if (!villaExist) {
        return res.status(404).json({
          status: "error",
          message: "Villa not found",
        });
      }

      const startDate = new Date(tanggal_mulai);
      const endDate = new Date(tanggal_selesai);

      const existingBookings = await Pesanan.find({
        villa,
        status: { $ne: "completed" },
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

      const newPesanan = new Pesanan({
        villa,
        tanggal_mulai,
        tanggal_selesai,
        harga,
        jumlah_orang,
        nama_pembayar,
        email_pembayar,
        catatan,
        user: userId,
      });
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
      const { tanggal_mulai, tanggal_selesai, villa } = req.body;

      // Validasi untuk memeriksa konflik booking dengan pesanan lain
      if (tanggal_mulai && tanggal_selesai && villa) {
        const startDate = new Date(tanggal_mulai);
        const endDate = new Date(tanggal_selesai);

        const existingBookings = await Pesanan.find({
          villa,
          _id: { $ne: req.params.id }, // Mengecualikan pesanan yang sedang diupdate
          status: { $ne: "completed" },
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
      }

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
        return res.status(404).json({
          status: "error",
          message: "Pesanan not found",
        });
      }

      await Pembayaran.deleteMany({ pesanan: req.params.id });

      return res.status(200).json({
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
