import { Request, Response } from "express";
import { Pembayaran } from "../models/pembayaranModel";
import { Pesanan } from "../models/pesananModel";
const midtransClient = require("midtrans-client");

const PembayaranController = {
  getAllPembayaran: async (req: Request, res: Response) => {
    try {
      const pembayaran = await Pembayaran.find().populate([
        {
          path: "pesanan",
          populate: [
            {
              path: "villa",
              populate: [
                {
                  path: "foto_villa",
                  model: "VillaPhoto",
                },
              ],
            },
          ],
        },
      ]);

      return res.status(200).json({
        status: "success",
        message: "Success get all pembayaran",
        data: pembayaran,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  getPembayaranById: async (req: Request, res: Response) => {
    try {
      const pembayaran = await Pembayaran.findById(req.params.id).populate([
        {
          path: "pesanan",
          populate: [
            {
              path: "villa",
              populate: [
                {
                  path: "foto_villa",
                  model: "VillaPhoto",
                },
              ],
            },
          ],
        },
      ]);
      if (!pembayaran) {
        return res.status(404).json({
          status: "error",
          message: "Pembayaran not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Success get pembayaran by id",
        data: pembayaran,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  createPembayaran: async (req: Request, res: Response) => {
    try {
      const {
        nama_pembayar,
        email_pembayar,
        kode_pembayaran,
        status_pembayaran,
        tanggal_pembayaran,
        metode_pembayaran,
        tipe_pembayaran,
        jumlah_pembayaran,
        expiry_time,
        nomor_va,
        pdf_url,
      } = req.body;

      const errors: Record<string, string> = {};

      // switch (tipe_pembayaran) {
      //   case "virtual_account":
      //     if (!nomor_va) {
      //       errors.nomor_va = "Nomor VA is required";
      //     }
      //     break;
      //   case "credit_card":
      //     break;
      //   default:
      //     errors.tipe_pembayaran = "Invalid payment type";
      //     break;
      // }

      if (!nama_pembayar) {
        errors.nama_pembayar = "Nama pembayar is required";
      }

      if (!email_pembayar) {
        errors.email_pembayar = "Email pembayar is required";
      }

      if (!kode_pembayaran) {
        errors.kode_pembayaran = "Kode pembayaran is required";
      }

      if (!status_pembayaran) {
        errors.status_pembayaran = "Status pembayaran is required";
      }

      if (!tanggal_pembayaran) {
        errors.tanggal_pembayaran = "Tanggal pembayaran is required";
      }

      if (!metode_pembayaran) {
        errors.metode_pembayaran = "Metode pembayaran is required";
      }

      if (!tipe_pembayaran) {
        errors.tipe_pembayaran = "Tipe pembayaran is required";
      }

      if (!jumlah_pembayaran) {
        errors.jumlah_pembayaran = "Jumlah pembayaran is required";
      }

      if (!expiry_time) {
        errors.expiry_time = "Expiry time is required";
      }

      if (!req.body.pesanan) {
        errors.pesanan = "Pesanan is required";
      }

      const pesanan = await Pesanan.findById(req.body.pesanan);

      if (!pesanan) {
        errors.pesanan = "Pesanan not found";
      }

      // Cek jika kode pembayaran sudah ada
      const kodePembayaranExist = await Pembayaran.findOne({
        kode_pembayaran,
      });

      if (kodePembayaranExist) {
        errors.kode_pembayaran = "Kode pembayaran already exist";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Bad request",
          errors,
        });
      }

      const newPembayaran = new Pembayaran({
        nama_pembayar,
        email_pembayar,
        kode_pembayaran,
        status_pembayaran,
        tanggal_pembayaran,
        metode_pembayaran,
        tipe_pembayaran,
        jumlah_pembayaran,
        expiry_time,
        nomor_va,
        pdf_url,
        pesanan: req.body.pesanan,
      });

      const savedPembayaran = await newPembayaran.save();
      return res.status(201).json({
        status: "success",
        message: "Pembayaran created successfully",
        data: savedPembayaran,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  updatePembayaran: async (req: Request, res: Response) => {
    try {
      const errors: Record<string, string> = {};

      const {
        nama_pembayar,
        email_pembayar,
        kode_pembayaran,
        status_pembayaran,
        tanggal_pembayaran,
        metode_pembayaran,
        tipe_pembayaran,
        jumlah_pembayaran,
        expiry_time,
        nomor_va,
        pdf_url,
      } = req.body;

      if (!nama_pembayar) {
        errors.nama_pembayar = "Nama pembayar is required";
      }

      if (!email_pembayar) {
        errors.email_pembayar = "Email pembayar is required";
      }

      if (!kode_pembayaran) {
        errors.kode_pembayaran = "Kode pembayaran is required";
      }

      if (!status_pembayaran) {
        errors.status_pembayaran = "Status pembayaran is required";
      }

      if (!tanggal_pembayaran) {
        errors.tanggal_pembayaran = "Tanggal pembayaran is required";
      }

      if (!metode_pembayaran) {
        errors.metode_pembayaran = "Metode pembayaran is required";
      }

      if (!tipe_pembayaran) {
        errors.tipe_pembayaran = "Tipe pembayaran is required";
      }

      if (!jumlah_pembayaran) {
        errors.jumlah_pembayaran = "Jumlah pembayaran is required";
      }

      if (!expiry_time) {
        errors.expiry_time = "Expiry time is required";
      }

      if (!req.body.pesanan) {
        errors.pesanan = "Pesanan is required";
      }

      if (req.body.pesanan) {
        const pesanan = await Pesanan.findById(req.body.pesanan);

        if (!pesanan) {
          errors.pesanan = "Pesanan not found";
        }
      }

      // cek apakah kode pembayaran sudah ada
      const kodePembayaranExist = await Pembayaran.findOne({
        kode_pembayaran,
      });

      if (kodePembayaranExist && kodePembayaranExist._id != req.params.id) {
        errors.kode_pembayaran = "Kode pembayaran already exist";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Bad request",
          errors,
        });
      }

      const updatedPembayaran = await Pembayaran.findByIdAndUpdate(
        req.params.id,
        {
          nama_pembayar,
          email_pembayar,
          kode_pembayaran,
          status_pembayaran,
          tanggal_pembayaran,
          metode_pembayaran,
          tipe_pembayaran,
          jumlah_pembayaran,
          expiry_time,
          nomor_va,
          pdf_url,
          pesanan: req.body.pesanan,
        },
        {
          new: true,
        }
      );
      if (!updatedPembayaran) {
        return res.status(404).json({
          status: "error",
          message: "Payment not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Payment updated successfully",
        data: updatedPembayaran,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  deletePembayaran: async (req: Request, res: Response) => {
    try {
      const deletedPembayaran = await Pembayaran.findByIdAndDelete(
        req.params.id
      );
      if (!deletedPembayaran) {
        return res.status(404).json({
          status: "error",
          message: "Payment not found",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "Payment deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  prosesPembayaran: async (req: Request, res: Response) => {
    try {
      const errors: Record<string, string> = {};

      const {
        nama_pembayar,
        email_pembayar,
        kode_pembayaran,
        jumlah_pembayaran,
      } = req.body;

      if (!nama_pembayar) {
        errors.nama_pembayar = "Nama pembayar is required";
      }

      if (!email_pembayar) {
        errors.email_pembayar = "Email pembayar is required";
      }

      if (!kode_pembayaran) {
        errors.kode_pembayaran = "Kode pembayaran is required";
      }

      if (!jumlah_pembayaran) {
        errors.jumlah_pembayaran = "Jumlah pembayaran is required";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Bad request",
          errors,
        });
      }

      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      const parameter = {
        transaction_details: {
          order_id: kode_pembayaran,
          gross_amount: jumlah_pembayaran,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: nama_pembayar,
          email: email_pembayar,
        },
      };

      const transaction = await snap.createTransaction(parameter);
      res.status(201).json({
        status: "success",
        message: "Create payment successfull",
        data: transaction,
        // token: transaction.token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  },
};

module.exports = PembayaranController;
