import { Request, Response } from "express";
import { Pesanan } from "../models/pesananModel";
import { Villa } from "../models/villaModel";
import { Pembayaran } from "../models/pembayaranModel";

const PesananController = {
  getAllPesanan: async (req: Request, res: Response): Promise<any> => {
    try {
      const { searchQuery, page = 1, limit = 5 } = req.query;

      // Konversi page dan limit menjadi angka
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const query: any = {};

      // if (searchQuery) {
      //   const sanitizedSearchQuery = searchQuery.toString().replace(/\./g, "");
      //   query.$or = [
      //     { jumlah_orang: { $regex: sanitizedSearchQuery, $options: "i" } }, // Pencarian pada jumlah_orang
      //     { catatan: { $regex: sanitizedSearchQuery, $options: "i" } }, // Pencarian pada catatan
      //     { status: { $regex: sanitizedSearchQuery, $options: "i" } }, // Pencarian pada status
      //     { "user.nama": { $regex: sanitizedSearchQuery, $options: "i" } }, // Pencarian pada nama user (pastikan user memiliki field 'name')
      //   ];
      // }
      if (searchQuery) {
        const sanitizedSearchQuery = searchQuery.toString();
        const isNumeric = !isNaN(Number(sanitizedSearchQuery));
        if (isNumeric) {
          query.jumlah_orang = Number(sanitizedSearchQuery);
        } else {
          query.$or = [
            { catatan: { $regex: sanitizedSearchQuery, $options: "i" } },
            { "villa.nama": { $regex: sanitizedSearchQuery, $options: "i" } },
          ];
        }
      }

      const pesanan = await Pesanan.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate({
          path: "villa",
          populate: [
            {
              path: "pemilik_villa",
              model: "User",
            },
            {
              path: "foto_villa",
              model: "VillaPhoto",
            },
          ],
        })
        .populate("user");
      const totalBookings = await Pembayaran.countDocuments(query);
      const totalPages = Math.ceil(totalBookings / limitNumber);
      return res.status(200).json({
        status: "success",
        message: "Success get all pesanan",
        pagination: {
          totalItems: totalBookings,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
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
            {
              path: "foto_villa",
              model: "VillaPhoto",
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

  getPesananByIdUser: async (req: Request, res: Response): Promise<any> => {
    try {
      const user = req.body.userLogin?.userId;
      const pesanan = await Pesanan.find({
        user: req.body.userLogin?.userId,
      }).populate([
        {
          path: "villa",
          populate: [
            { path: "pemilik_villa", model: "User" },
            { path: "foto_villa", model: "VillaPhoto" },
            { path: "ulasan", model: "Ulasan", match: { user: user } },
          ],
        },
        "user",
      ]);

      return res.status(200).json({
        status: "success",
        message: "Success get pesanan by user id",
        data: pesanan,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  createPesanan: async (req: Request, res: Response): Promise<any> => {
    try {
      const errors: Record<string, string> = {};
      const {
        villa,
        tanggal_mulai,
        tanggal_selesai,
        harga,
        jumlah_orang,
        catatan,
        status,
      } = req.body;

      const userId = req.body.userLogin?.userId;

      if (!userId) {
        errors.user = "User is required";
      }

      if (!villa) {
        errors.villa = "Villa is required";
      } else {
        const villaData = await Villa.findById(villa);
        if (!villaData) {
          errors.villa = "Villa not found";
        }
      }

      if (!tanggal_mulai) {
        errors.tanggal_mulai = "Tanggal mulai is required";
      }

      if (!tanggal_selesai) {
        errors.tanggal_selesai = "Tanggal selesai is required";
      }

      if (!harga) {
        errors.harga = "Harga is required";
      }

      if (!jumlah_orang) {
        errors.jumlah_orang = "Jumlah orang is required";
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
        errors.villa = "Villa is already booked for the selected dates";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Bad request",
          errors,
        });
      }

      const newPesanan = new Pesanan({
        villa,
        tanggal_mulai,
        tanggal_selesai,
        harga,
        jumlah_orang,
        catatan,
        user: userId,
        status,
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
      const errors: Record<string, string> = {};
      const { tanggal_mulai, tanggal_selesai, villa } = req.body;

      if (villa) {
        const villaData = await Villa.findById(villa);
        if (!villaData) {
          errors.villa = "Villa not found";
        }
      }

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
          errors.villa = "Villa is already booked for the selected dates";
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Bad request",
          errors,
        });
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
