const cron = require("node-cron");
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Pesanan } from "../models/pesananModel";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

// Koneksi ke database
mongoose
  .connect(MONGO_URI || "")
  .then(() => {
    console.log("Connected to MongoDB for scheduler");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Menjadwalkan cron job untuk berjalan setiap hari pada tengah malam
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    // Cari pesanan yang tanggal selesai-nya sudah lewat dan statusnya belum completed
    const pesananToUpdate = await Pesanan.updateMany(
      {
        tanggal_selesai: { $lt: now },
        status: { $ne: "completed" },
      },
      { $set: { status: "completed" } }
    );

    if (pesananToUpdate.modifiedCount > 0) {
      console.log(
        `${pesananToUpdate.modifiedCount} pesanan diperbarui menjadi completed`
      );
    } else {
      console.log("Tidak ada pesanan yang perlu diperbarui");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
});
