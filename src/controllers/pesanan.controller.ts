import { Request, Response } from "express";
import { stat } from "fs";

// Model
const { Pesanan } = require("../models/pesanan");

const pesananController = {
  getAllPesanan: async (req: Request, res: Response) => {
    try {
      const pesanan = await Pesanan.find().populate("user villa");
      return res.status(200).json({
        status: "success",
        message: "Success get all pesanan",
        data: pesanan,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  },
  getPesananById: async (req: Request, res: Response) => {
    try {
      const pesanan = await Pesanan.findById(req.params.id).populate(
        "user villa"
      );
      if (!pesanan) {
        return res.status(404).json({ message: "Pesanan not found" });
      }
      return res.status(200).json({
        success: "success",
        message: "Success get pesanan by id",
        data: pesanan,

        // data: movies,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        success: "error",
        message: "Internal server error",
      });
    }
  },

  createPesanan: async (req: Request, res: Response) => {
    try {
      const newPesanan = new Pesanan(req.body);
      const savedPesanan = await newPesanan.save();
      return res.status(201).json({
        status: "success",
        message: "Success add new pesanan",
        data: savedPesanan,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
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
        return res.status(404).json({ message: "Pesanan not found" });
      }
      return res.status(201).json({
        status: "success",
        message: "Success update pesanan",
        data: updatedPesanan,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  },
  deletePesanan: async (req: Request, res: Response) => {
    try {
      const deletedPesanan = await Pesanan.findByIdAndDelete(req.params.id);
      if (!deletedPesanan) {
        return res.status(404).json({ message: "Pesanan not found" });
      }
      return res.status(201).json({
        status: "success",
        message: "Success delete pesanan by id",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  },
};

module.exports = pesananController;
