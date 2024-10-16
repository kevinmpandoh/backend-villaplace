import { Request, Response } from "express";

// Model
const { Movie } = require("../../models/exampleModel");

// Fungsi untuk mendapatkan semua user
const exampleController = {
  getExample: async (req: Request, res: Response) => {
    try {
      const movies = await Movie.find();
      return res.status(200).json({
        success: true,
        data: movies,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  createExample: async (req: Request, res: Response) => {
    try {
      const { title, genre } = req.body;
      const movie = new Movie({
        title,
        genre,
      });
      await movie.save();
      return res.status(201).json({
        success: true,
        data: movie,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = exampleController;
