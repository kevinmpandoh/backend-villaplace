const cron = require("node-cron");
import { Pembayaran } from "../models/pembayaranModel";
import { Pesanan } from "../models/pesananModel";
import { midtransClientConfig } from "../config/midtransClient";

cron.schedule("* * * * *", async () => {
  try {
    console.log("Checking for pending payments...");

    const pendingPayments = await Pembayaran.find({
      status_pembayaran: { $in: ["pending", "in-progress"] },
    });

    for (const payment of pendingPayments) {
      try {
        const pesanan = await Pesanan.findById(payment.pesanan).populate(
          "user"
        );
        const response = await midtransClientConfig.transaction.status(
          payment.kode_pembayaran
        );

        if (response.transaction_status === "settlement") {
          payment.status_pembayaran = "success";
          console.log(`Payment ${payment.kode_pembayaran} marked as success.`);

          if (pesanan) {
            pesanan.status = "success";
            await pesanan.save();
            console.log(`Pesanan ${pesanan._id} marked as success.`);
          }
        } else if (
          ["expire", "cancel", "deny"].includes(response.transaction_status)
        ) {
          payment.status_pembayaran = "failed";
          console.log(`Payment ${payment.kode_pembayaran} marked as failed.`);

          if (pesanan) {
            pesanan.status = "canceled";
            await pesanan.save();
            console.log(`Pesanan ${pesanan._id} marked as canceled.`);
          }
        }

        await payment.save();
      } catch (error) {
        console.error(
          `Error checking status for payment ${payment.kode_pembayaran}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error in payment status update scheduler:", error);
  }
});
