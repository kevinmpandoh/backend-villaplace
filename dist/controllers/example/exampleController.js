"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Model
const { Movie } = require("../../models/exampleModel");
// Fungsi untuk mendapatkan semua user
const exampleController = {
    getExample: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const movies = yield Movie.find();
            return res.status(200).json({
                success: true,
                data: movies,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }),
    createExample: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title, genre } = req.body;
            const movie = new Movie({
                title,
                genre,
            });
            yield movie.save();
            return res.status(201).json({
                success: true,
                data: movie,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }),
};
module.exports = exampleController;
