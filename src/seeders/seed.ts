// seed.ts
import mongoose from "mongoose";
import userSeeder from "./userSeeder";
import ownerSeeder from "./ownerSeeder";
import adminSeeder from "./adminSeeder";
import villaSeeder from "./villaSeeder";
import villaPhotoSeeder from "./villaPhotoSeeder";

const main = async () => {
  try {
    // Koneksi ke database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/villaplace"
    );
    console.log("Connected to MongoDB");

    // Jalankan seeder setelah koneksi berhasil
    await userSeeder();
    await ownerSeeder();
    await adminSeeder();
    await villaSeeder();

    // Jalankan seeder foto villa
    // await villaPhotoSeeder();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Tutup koneksi setelah operasi selesai
    mongoose.connection.close();
  }
};

main().catch((err) => console.error("Error in main function:", err));
