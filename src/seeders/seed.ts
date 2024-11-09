// seed.ts
import mongoose from "mongoose";
import userSeeder from "./userSeeder";
import ownerSeeder from "./ownerSeeder";
import adminSeeder from "./adminSeeder";
import villaPhotoSeeder from "./villaPhotoSeeder";
import villaSeeder from "./villaSeeder";

const main = async () => {
  try {
    // Koneksi ke database
    await mongoose.connect("mongodb://localhost:27017/villaplace");
    console.log("Connected to MongoDB");

    // Jalankan seeder setelah koneksi berhasil
    await userSeeder();
    await ownerSeeder();
    await adminSeeder();
    await villaPhotoSeeder();
    await villaSeeder();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Tutup koneksi setelah operasi selesai
    mongoose.connection.close();
  }
};

main().catch((err) => console.error("Error in main function:", err));
