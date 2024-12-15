import { Pesanan } from "../models/pesananModel";
import User from "../models/userModel";
import { Villa } from "../models/villaModel";

const getRandomItem = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDateInMonth = (year: number, month: number) => {
  const day = Math.floor(Math.random() * 28) + 1; // Menghindari masalah di bulan Februari
  return new Date(year, month, day);
};

const pesananSeeder = async () => {
  console.log("Seeding Pesanan...");

  try {
    await Pesanan.deleteMany({}); // Hapus semua data pesanan sebelumnya
    // Ambil data user dan villa untuk referensi
    const users = await User.find();
    const villas = await Villa.find();

    if (users.length === 0 || villas.length === 0) {
      console.log("No users or villas found to create orders.");
      return;
    }

    const currentYear = new Date().getFullYear();

    // Loop melalui setiap villa
    for (const villa of villas) {
      // Tentukan jumlah pesanan untuk villa ini (antara 6-12)
      const pesananCount = Math.floor(Math.random() * 7) + 6; // Minimal 6, maksimal 12
      const pesananData = [];

      for (let i = 0; i < pesananCount; i++) {
        const randomMonth = Math.floor(Math.random() * 12); // Bulan acak (0-11)
        const startDate = getRandomDateInMonth(currentYear, randomMonth);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1); // Tanggal selesai (1-5 hari setelah mulai)

        const pesanan = {
          harga: Math.floor(Math.random() * 5000000) + 1000000, // Harga antara 1 juta - 5 juta
          jumlah_orang: Math.floor(Math.random() * 10) + 1, // Jumlah orang antara 1-10
          catatan: `Pesanan untuk villa ${villa.nama} secara otomatis`,
          status: "completed",
          tanggal_mulai: startDate,
          tanggal_selesai: endDate,
          user: getRandomItem(users)._id, // Pilih user secara acak
          villa: villa._id, // Assign villa saat ini
        };

        pesananData.push(pesanan);
      }

      // Masukkan data pesanan ke database untuk villa ini
      await Pesanan.insertMany(pesananData);
      console.log(`Added ${pesananCount} orders for villa: ${villa._id}`);
    }

    console.log("Pesanan seeded successfully!");
  } catch (error) {
    console.error("Error seeding pesanan:", error);
  }
};

export default pesananSeeder;
