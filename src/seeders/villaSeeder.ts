import mongoose from "mongoose";
import { Villa } from "../models/villaModel";
import Owner from "../models/ownerModel";
import villaData from "./villaData";

const villaSeeder = async () => {
  try {
    console.log("Seeding Villas...");

    // Ambil semua data owner yang ada di database
    const owners = await Owner.find();
    if (!owners.length) {
      console.log("No owners found. Please seed the owner collection first.");
      return;
    }

    // Hapus semua data villa yang ada sebelumnya
    await Villa.deleteMany({});
    console.log("All existing villas have been deleted.");

    // Tambahkan data villa baru
    for (const villa of villaData) {
      // Pilih owner secara acak
      const randomOwner = owners[Math.floor(Math.random() * owners.length)];

      // Buat instance villa baru
      const newVilla = new Villa({
        ...villa,
        pemilik_villa: randomOwner._id,
      });

      // Simpan villa ke database
      await newVilla.save();
    }

    console.log("Villas have been seeded successfully.");
  } catch (error) {
    console.error("Error seeding Villas:", error);
  }
};

export default villaSeeder;
