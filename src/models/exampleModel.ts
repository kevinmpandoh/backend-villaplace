import { Schema, model } from "mongoose";

interface IMovie {
  title: string;
  genre: string;
}

const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

export const Movie = model<IMovie>("Movie", movieSchema);
