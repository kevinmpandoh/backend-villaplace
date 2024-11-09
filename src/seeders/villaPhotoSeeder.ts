// seeders/villaPhotoSeeder.ts
import mongoose from "mongoose";
import { VillaPhoto } from "../models/villaPhotoModel";

const villaPhotoSeeder = async () => {
  try {
    const deleteResult = await VillaPhoto.deleteMany(); // Menghapus data sebelumnya
    console.log(`Deleted ${deleteResult.deletedCount} photo villa(s)`);

    const photos = [
      {
        name: "Photo 1",
        url: "https://example.com/photo1.jpg",
        filepath: "/photos/photo1.jpg",
        villa: new mongoose.Types.ObjectId(), // Ganti dengan ID villa yang valid
      },
      {
        name: "Photo 2",
        url: "https://example.com/photo2.jpg",
        filepath: "/photos/photo2.jpg",
        villa: new mongoose.Types.ObjectId(), // Ganti dengan ID villa yang valid
      },
      {
        name: "Photo 3",
        url: "https://example.com/photo3.jpg",
        filepath: "/photos/photo3.jpg",
        villa: new mongoose.Types.ObjectId(), // Ganti dengan ID villa yang valid
      },
    ];

    await VillaPhoto.insertMany(photos);
    console.log("VillaPhoto seeder completed successfully");
  } catch (error) {
    console.error("Error seeding villa photos:", error);
  }
};

export default villaPhotoSeeder;
