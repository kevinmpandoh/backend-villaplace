import { Request, Response } from "express";
import { Favorite } from "../models/Favorite";

const favoriteController = {
  getAllFavorite: async (req: Request, res: Response) => {
    try {
      const userId = req.body.userLogin.userId;
      const favorite = await Favorite.find({ user: userId }).populate({
        path: "villa",
        populate: [
          {
            path: "kategori",
          },
          {
            path: "foto_villa",
          },
        ],
      });
      return res.status(200).json({
        status: "success",
        message: "Success get all favorite for user",
        data: favorite,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  getFavoriteByVilla: async (req: Request, res: Response) => {
    try {
      const userId = req.body.userLogin.userId;
      const { id } = req.params;
      const favorite = await Favorite.findOne({ villa: id, user: userId });
      return res.status(200).json({
        status: "success",
        message: "Success get favorite by villa",
        data: favorite,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  createFavorite: async (req: Request, res: Response) => {
    try {
      const userId = req.body.userLogin.userId;
      const { villa } = req.body;
      const existingFavorite = await Favorite.findOne({
        user: userId,
        villa: villa,
      });

      if (existingFavorite) {
        return res.status(400).json({
          status: "error",
          message: "This villa is already saved as a favorite by this user.",
        });
      }

      const newFavorite = new Favorite({
        user: userId,
        villa: villa,
      });
      const savedFavorite = await newFavorite.save();

      return res.status(201).json({
        status: "success",
        message: "Villa created successfully",
        data: savedFavorite,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  deleteFavorite: async (req: Request, res: Response) => {
    try {
      const userId = req.body.userLogin.userId;
      const { id } = req.params;

      const deletedFavorite = await Favorite.findOneAndDelete({
        _id: id,
        user: userId,
      });

      if (!deletedFavorite) {
        return res.status(404).json({
          status: "error",
          message: "Favorite not found for this user",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Favorite deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  deleteFavoriteByDetail: async (req: Request, res: Response) => {
    try {
      const userId = req.body.userLogin.userId;
      const { id } = req.params;

      const deletedFavorite = await Favorite.findOneAndDelete({
        villa: id,
        user: userId,
      });

      if (!deletedFavorite) {
        return res.status(404).json({
          status: "error",
          message: "Favorite not found for this user",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Favorite deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
};
module.exports = favoriteController;
