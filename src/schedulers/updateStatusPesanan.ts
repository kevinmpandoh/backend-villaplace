const cron = require("node-cron");
import { Pesanan } from "../models/pesananModel";
import { Pembayaran } from "../models/pembayaranModel";

// Menjadwalkan cron job untuk berjalan setiap hari pada tengah malam
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();
    const pesananToUpdate = await Pesanan.find({
      tanggal_selesai: { $lt: now },
      status: "success", // Hanya pesanan yang sudah dibayar
    });

    for (const pesanan of pesananToUpdate) {
      try {
        // Periksa apakah status pembayaran terkait adalah success
        const pembayaran = await Pembayaran.findOne({
          pesanan: pesanan._id,
          status_pembayaran: "success",
        });

        if (pembayaran) {
          pesanan.status = "completed";
          await pesanan.save();
          console.log(`Order ${pesanan._id} marked as completed.`);
        }
      } catch (error) {
        console.error(`Error updating order ${pesanan._id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error updating order status:", error);
  }
});
