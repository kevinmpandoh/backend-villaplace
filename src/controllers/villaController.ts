import { Request, Response } from "express";
import { Villa } from "../models/villaModel";
import { VillaPhoto } from "../models/villaPhotoModel";
import { Ulasan } from "../models/Ulasan";
import { Favorite } from "../models/Favorite";
import { Pesanan } from "../models/pesananModel";
import Owner from "../models/ownerModel";


import fs from "fs";
import path from "path";

const VillaController = {
  getAllVillas: async (req: Request, res: Response) => {
    try {
      const {
        searchQuery,
        harga_min,
        harga_max,
        page = 1,
        limit = 5,
      } = req.query;
      const query: any = {
        
      };
      if (searchQuery) {
        const sanitizedSearchQuery = searchQuery.toString().replace(/\./g, "");
  
        query.$or = [
          { nama: { $regex: searchQuery, $options: "i" } },
          { lokasi: { $regex: searchQuery, $options: "i" } },
          { kategori: { $elemMatch: { $regex: searchQuery, $options: "i" } } },
        ];
  
        if (!isNaN(Number(sanitizedSearchQuery))) {
          query.$or.push({ harga: Number(sanitizedSearchQuery) });
          query.$or.push({
            harga: { $regex: new RegExp(sanitizedSearchQuery, "i") },
          });
        }
      }
      
      // Membangun query filter secara dinamis
      if (harga_min) query.harga = { ...query.harga, $gte: Number(harga_min) };
      if (harga_max) query.harga = { ...query.harga, $lte: Number(harga_max) };

      // Konversi page dan limit menjadi angka
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      // Mendapatkan data villa dengan pagination dan populate
      const villas = await Villa.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate("pemilik_villa foto_villa");

      const villaDetails = await Promise.all(
        villas.map(async (villa) => {
          const ulasans = await Ulasan.find({ villa: villa._id })
            .populate("user")
            .exec();
          const totalRating = ulasans.reduce(
            (sum, ulasan) => sum + ulasan.rating,
            0
          );
          const averageRating =
            ulasans.length > 0 ? totalRating / ulasans.length : 0;
          const commentCount = ulasans.length;

          return {
            ...villa.toObject(),
            averageRating: averageRating,
            commentCount: commentCount,
          };
        })
      );

      const totalVillas = await Villa.countDocuments(query);
      const totalPages = Math.ceil(totalVillas / limitNumber);

      return res.status(200).json({
        status: "success",
        message: "Success get all villas",

        pagination: {
          totalVillas,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
        data: villaDetails,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  getAllVillasOwner: async (req: Request, res: Response) => {
    try {
      const {
        searchQuery,
        page = 1,
        limit = 10,
        showPending,
      } = req.query;
  
      const { id } = req.params;
  
      const query: any = {};
  
      if (id) {
        query.pemilik_villa = id;
      }
  
      if (showPending === "true") {
        query.status = "pending";
      }
  
      if (searchQuery) {
        const sanitizedSearchQuery = searchQuery.toString().replace(/\./g, "");
  
        query.$or = [
          { nama: { $regex: searchQuery, $options: "i" } },
          { lokasi: { $regex: searchQuery, $options: "i" } },
          { kategori: { $elemMatch: { $regex: searchQuery, $options: "i" } } },
        ];
  
        if (!isNaN(Number(sanitizedSearchQuery))) {
          query.$or.push({ harga: Number(sanitizedSearchQuery) });
          query.$or.push({
            harga: { $regex: new RegExp(sanitizedSearchQuery, "i") },
          });
        }
      }
      // Pagination setup
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
  
      // Get villas based on the query, with pagination and population
      const villas = await Villa.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate("pemilik_villa foto_villa");
  
      // Enrich the villa data with rating and comment count
      const villaDetails = await Promise.all(
        villas.map(async (villa) => {
          const ulasans = await Ulasan.find({ villa: villa._id })
            .populate("user")
            .exec();
          const totalRating = ulasans.reduce(
            (sum, ulasan) => sum + ulasan.rating,
            0
          );
          const averageRating =
            ulasans.length > 0 ? totalRating / ulasans.length : 0;
          const commentCount = ulasans.length;
  
          return {
            ...villa.toObject(),
            averageRating: averageRating,
            commentCount: commentCount,
          };
        })
      );
  
      // Get the total number of villas and calculate total pages for pagination
      const totalVillas = await Villa.countDocuments(query);
      const totalPages = Math.ceil(totalVillas / limitNumber);
  
      return res.status(200).json({
        status: "success",
        message: "Success get all villas",
        pagination: {
          totalVillas,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
        data: villaDetails,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  getAllVillasAdmin: async (req: Request, res: Response) => {
    try {
      const {
        searchQuery,
        page = 1,
        limit = 10,
        showPending,
      } = req.query;
    
      const query: any = {};
  
      if (showPending === "true") {
        query.status = "pending";
      }
  
      if (searchQuery) {
        const sanitizedSearchQuery = searchQuery.toString().replace(/\./g, "");
  
        query.$or = [
          { nama: { $regex: searchQuery, $options: "i" } },
          { lokasi: { $regex: searchQuery, $options: "i" } },
          { kategori: { $elemMatch: { $regex: searchQuery, $options: "i" } } },
        ];
  
        if (!isNaN(Number(sanitizedSearchQuery))) {
          query.$or.push({ harga: Number(sanitizedSearchQuery) });
          query.$or.push({
            harga: { $regex: new RegExp(sanitizedSearchQuery, "i") },
          });
        }
      }

      // Pagination setup
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
  
      // Get villas based on the query, with pagination and population
      const villas = await Villa.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate("pemilik_villa foto_villa");
  
      // Enrich the villa data with rating and comment count
      const villaDetails = await Promise.all(
        villas.map(async (villa) => {
          const ulasans = await Ulasan.find({ villa: villa._id })
            .populate("user")
            .exec();
          const totalRating = ulasans.reduce(
            (sum, ulasan) => sum + ulasan.rating,
            0
          );
          const averageRating =
            ulasans.length > 0 ? totalRating / ulasans.length : 0;
          const commentCount = ulasans.length;
  
          return {
            ...villa.toObject(),
            averageRating: averageRating,
            commentCount: commentCount,
          };
        })
      );
  
      // Get the total number of villas and calculate total pages for pagination
      const totalVillas = await Villa.countDocuments(query);
      const totalPages = Math.ceil(totalVillas / limitNumber);
  
      return res.status(200).json({
        status: "success",
        message: "Success get all villas",
        pagination: {
          totalVillas,
          totalPages,
          currentPage: pageNumber,
          limit: limitNumber,
        },
        data: villaDetails,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  
  
  

  getVillaById: async (req: Request, res: Response) => {
    try {
      const villa = await Villa.findById(req.params.id).populate(
        "pemilik_villa foto_villa"
      );
  
      if (!villa) {
        return res.status(404).json({
          status: "error",
          message: "Villa not found",
        });
      }
  
      // Pesanan
      const pesanans = await Pesanan.find({ villa: req.params.id })
        .populate("user")
        .exec();
  
      // Ulasan
      const ulasans = await Ulasan.find({ villa: req.params.id })
        .populate("user")
        .exec();
      const totalRating = ulasans.reduce(
        (sum, ulasan) => sum + ulasan.rating,
        0
      );
      const averageRating =
        ulasans.length > 0 ? totalRating / ulasans.length : 0;
      const commentCount = ulasans.length;
  
      // Calculate percentage of each star rating
      const starCount = [0, 0, 0, 0, 0]; // Array to store count for 1 to 5 stars
  
      ulasans.forEach((ulasan) => {
        if (ulasan.rating >= 1 && ulasan.rating <= 5) {
          starCount[ulasan.rating - 1] += 1; // Increment count for the rating
        }
      });
  
      const starPercentage = starCount.map(
        (count) => (ulasans.length > 0 ? (count / ulasans.length) * 100 : 0)
      );
  
      return res.status(200).json({
        status: "success",
        message: "Success get villa by id",
        data: {
          ...villa.toObject(),
          averageRating: averageRating,
          commentCount: commentCount,
          ulasan: ulasans.map((ulasan) => ({
            komentar: ulasan.komentar,
            rating: ulasan.rating,
            user: ulasan.user,
            _id: ulasan._id,
          })),
          pesanans: pesanans,
          starPercentage: starPercentage, // Add the star rating percentage
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  

  createVilla: async (req: Request, res: Response) => {
    try {
      const pemilik_villa = req.body.owner.ownerId;

      const newVilla = new Villa({ ...req.body, pemilik_villa });

      const savedVilla = await newVilla.save();
      return res.status(201).json({
        status: "success",
        message: "Villa created successfully",
        data: savedVilla,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  updateVilla: async (req: Request, res: Response) => {
    try {
      req.body.status = "pending";

      const updatedVilla = await Villa.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedVilla) {
        return res.status(404).json({
          status: "error",
          message: "Villa not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Villa updated successfully",
        data: updatedVilla,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  deleteVilla: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedVilla = await Villa.findByIdAndDelete(id);

      if (!deletedVilla) {
        return res.status(404).json({
          status: "error",
          message: "Villa not found",
        });
      }

      await Pesanan.deleteMany({ villa: id });
      await Favorite.deleteMany({ villa: id });
      await Ulasan.deleteMany({ villa: id });
      await VillaPhoto.deleteMany({ villa: id });

      return res.status(200).json({
        status: "success",
        message:
          "Villa deleted successfully, and all related data has been deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  uploadVillaImages: async (req: Request, res: Response) => {
    try {
      const villaId = req.params.id;
      const imageFiles = req.files as Express.Multer.File[];

      if (!imageFiles || imageFiles.length === 0) {
        return res.status(400).json({ message: "No files were uploaded." });
      }

      // Buat array objek foto dengan URL dan nama file
      const photos = await Promise.all(
        imageFiles.map(async (file) => {
          const photo = await VillaPhoto.create({
            url: `${req.protocol}://${req.get("host")}/images/villa/${
              file.filename
            }`,
            name: file.filename,
            villa: villaId,
            filepath: file.path,
          });
          return photo._id; // Mengembalikan ID foto yang baru dibuat
        })
      );

      const villa = await Villa.findByIdAndUpdate(
        villaId,
        { $push: { foto_villa: { $each: photos } } },
        { new: true }
      );

      if (!villa) {
        return res.status(404).json({ message: "Villa not found" });
      }

      res.status(201).json({
        status: "success",
        message: "Villa images uploaded successfully",
        data: villa,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Failed to upload villa images",
      });
    }
  },

  getVillaImages: async (req: Request, res: Response) => {
    try {
      const villaId = req.params.id;
      const villa = await Villa.findById(villaId).populate("foto_villa");

      if (!villa) {
        return res
          .status(404)
          .json({ status: "error", message: "Villa not found" });
      }

      return res.status(200).json({
        status: "success",
        message: "Get all photo villa by id villa",
        photos: villa.foto_villa,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Failed to get villa photos",
      });
    }
  },

  deleteVillaImage: async (req: Request, res: Response) => {
    try {
      const villaId = req.params.id;
      const photoId = req.params.photoId;

      // Temukan villa dan pastikan foto ada di dalamnya
      const villa = await Villa.findById(villaId);
      if (!villa) {
        return res.status(404).json({ message: "Villa not found" });
      }

      // Periksa apakah photoId ada di dalam array photos
      const isPhotoExist = villa.foto_villa.some(
        (photo) => photo.toString() === photoId
      );

      if (!isPhotoExist) {
        return res
          .status(404)
          .json({ status: "error", message: "Photo not found" });
      }
      // cari foto_villa berdasarkan photoId
      const villaPhoto = await VillaPhoto.findById(photoId);
      if (!villaPhoto) {
        return res.status(404).json({ message: "Photo not found" });
      }

      // Hapus file dari sistem file
      const filePath = path.join(__dirname, "..", "..", villaPhoto.filepath);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete file:", err);
          return res.status(500).json({ message: "Failed to delete file" });
        }
      });

      // Hapus foto dari collection Photo
      await VillaPhoto.findByIdAndDelete(photoId);

      // Hapus ID foto dari array photos di dokumen villa
      villa.foto_villa = villa.foto_villa.filter(
        (image) => image.toString() !== photoId
      );
      await villa.save();

      res.status(200).json({
        status: "success",
        message: "Photo deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Failed to delete villa photo",
      });
    }
  },

  updateVillaStatus: async (req: Request, res: Response) => {
    try {
      if (!req.body.status) {
        return res.status(400).json({
          status: "error",
          message: "Status field is required to update",
        });
      }
      const updatedVilla = await Villa.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!updatedVilla) {
        return res.status(404).json({
          status: "error",
          message: "Villa not found",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Villa status updated successfully",
        data: updatedVilla,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  getBookedDatesByVillaId: async (req: Request, res: Response) => {
    try {
      const villaId = req.params.id;

      // Cari semua pesanan yang terkait dengan villa tertentu
      const bookings = await Pesanan.find(
        { villa: villaId },
        "tanggal_mulai tanggal_selesai"
      );

      if (bookings.length === 0) {
        return res
          .status(200)
          .json({ message: "No bookings found for this villa", dates: [] });
      }

      // Format hasil menjadi array tanggal mulai dan tanggal selesai
      const bookedDates = bookings.map((booking) => ({
        tanggal_mulai: booking.tanggal_mulai,
        tanggal_selesai: booking.tanggal_selesai,
      }));

      return res.status(200).json({
        status: "success",
        message: "Get all booked dates by villa id",
        data: bookedDates,
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

module.exports = VillaController;
