import { Pembayaran } from "../models/pembayaranModel";
import { Pesanan } from "../models/pesananModel";

const pembayaranSeeder = async () => {
  console.log("Seeding Pembayaran...");

  try {
    // Hapus data lama
    await Pembayaran.deleteMany({});
    console.log("Existing Pembayaran deleted.");

    // Ambil data pesanan
    const pesananList = await Pesanan.find();

    if (!pesananList.length) {
      console.log("No Pesanan found to create Pembayaran.");
      return;
    }

    const pembayaranData = [] as any;
    const banks = ["bni", "bri", "bca", "cimb"];
    let kodeCounter = 1;

    pesananList.forEach((pesanan) => {
      const randomBank = banks[Math.floor(Math.random() * banks.length)];
      const tanggalPembayaran = new Date(pesanan.tanggal_mulai);
      const expiryTime = new Date(tanggalPembayaran);
      expiryTime.setDate(tanggalPembayaran.getDate() + 1);

      pembayaranData.push({
        nama_pembayar: `Pembayar-${kodeCounter}`,
        email_pembayar: `pembayar${kodeCounter}@example.com`,
        kode_pembayaran: `PAY-${kodeCounter.toString().padStart(6, "0")}`,
        status_pembayaran:
          pesanan.status === "success" || pesanan.status === "completed"
            ? "success"
            : "failed",
        tanggal_pembayaran: tanggalPembayaran,
        metode_pembayaran: "bank_transfer",
        jumlah_pembayaran: pesanan.harga,
        expiry_time: expiryTime,
        bank: randomBank,
        nomor_va: Math.floor(
          Math.random() * 9000000000 + 1000000000
        ).toString(),
        pdf_url: `http://localhost:8000/pembayaran/${kodeCounter}`,
        pesanan: pesanan._id,
      });

      kodeCounter++;
    });

    // Simpan pembayaran
    const pembayaran = await Pembayaran.insertMany(pembayaranData);
    console.log(`Created ${pembayaran.length} Pembayaran.`);
  } catch (error) {
    console.error("Error seeding Pembayaran:", error);
  }
};

export default pembayaranSeeder;
