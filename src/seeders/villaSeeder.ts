// seeders/villaSeeder.ts
import mongoose from "mongoose";
import { Villa } from "../models/villaModel";
import { VillaPhoto } from "../models/villaPhotoModel";

const villaSeeder = async () => {
  try {
    const deleteResult = await Villa.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} villa(s)`);

    // Ambil data foto yang sudah di-seed sebelumnya
    const villaPhotos = await VillaPhoto.find();

    if (villaPhotos.length === 0) {
      console.log(
        "No villa photos found. Please run the villa photo seeder first."
      );
      return;
    }
    // Data villa
    const villas = [
      {
        nama: "Villa Sunrise",
        deskripsi: "Villa dengan pemandangan matahari terbit yang indah",
        lokasi: "Bali",
        kategori: ["Luxury", "Beachfront"],
        fasilitas: ["Kolam Renang", "WiFi", "AC"],
        harga: 3000000,
        foto_villa: villaPhotos.map((photo: any) => photo._id),
        pemilik_villa: new mongoose.Types.ObjectId(),
        ulasan: [],
        pesanan: [],
      },
      {
        nama: "Villa Sunset",
        deskripsi: "Villa dengan pemandangan matahari terbenam yang indah",
        lokasi: "Bali",
        kategori: ["Luxury", "Beachfront"],
        fasilitas: ["Kolam Renang", "WiFi", "AC"],
        harga: 3500000,
        foto_villa: villaPhotos.map((photo: any) => photo._id),
        pemilik_villa: new mongoose.Types.ObjectId(),
        ulasan: [],
        pesanan: [],
      },

      {
        nama: "Villa Indah",
        deskripsi: "Villa dengan pemandangan alam yang indah",
        lokasi: "Bandung",
        kategori: ["Luxury", "Mountain View"],
        fasilitas: ["Kolam Renang", "WiFi", "AC"],
        harga: 2500000,
        foto_villa: villaPhotos.map((photo: any) => photo._id),
        pemilik_villa: new mongoose.Types.ObjectId(),
        ulasan: [],
        pesanan: [],
      },

      {
        nama: "Villa Pantai",
        deskripsi: "Villa dengan pemandangan pantai yang indah",
        lokasi: "Lombok",
        kategori: ["Luxury", "Beachfront"],
        fasilitas: ["Kolam Renang", "WiFi", "AC"],
        harga: 4000000,
        foto_villa: [],
        pemilik_villa: new mongoose.Types.ObjectId(),
        ulasan: [],
        pesanan: [],
      },

      {
        nama: "Villa Gunung",
        deskripsi: "Villa dengan pemandangan gunung yang indah",
        lokasi: "Bali",
        kategori: ["Luxury", "Mountain View"],
        fasilitas: ["Kolam Renang", "WiFi", "AC"],
        harga: 3500000,
        foto_villa: [],
        pemilik_villa: new mongoose.Types.ObjectId(),
        ulasan: [],
        pesanan: [],
      },
    ];

    await Villa.insertMany(villas);
    console.log("Villa seeder completed successfully");
  } catch (error) {
    console.error("Error seeding villas:", error);
  }
};

export default villaSeeder;
