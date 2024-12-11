import mongoose from "mongoose";
import { Villa } from "../models/villaModel";
import Owner from "../models/ownerModel";

const villaSeeder = async () => {
  try {
    console.log("Seeding Villas...");

    // Ambil semua data owner yang ada di database
    const owners = await Owner.find();
    if (!owners.length) {
      console.log("No owners found. Please seed the owner collection first.");
      return;
    }

    // Data contoh villa
    const villaData = [
      {
        nama: "Villa Mewah Bandung",
        deskripsi: "Villa dengan pemandangan pegunungan yang asri di Bandung.",
        lokasi: "Bandung, Jawa Barat",
        kategori: ["Villa Mewah", "Villa Bandung"],
        fasilitas: [
          "Kamar 3",
          "K. Mandi 2",
          "Kolam Renang",
          "WiFi",
          "Dapur Lengkap",
        ],
        harga: 1500000,
        status: "success",
      },
      {
        nama: "Villa Hemat Bogor",
        deskripsi: "Villa terjangkau untuk keluarga kecil di Bogor.",
        lokasi: "Bogor, Jawa Barat",
        kategori: ["Villa Murah", "Villa Bogor"],
        fasilitas: ["Kamar 2", "K. Mandi 1", "WiFi", "Parkir Gratis"],
        harga: 750000,
        status: "success",
      },
      {
        nama: "Villa Santai Bali",
        deskripsi: "Villa eksklusif di Bali dengan akses langsung ke pantai.",
        lokasi: "Bali, Indonesia",
        kategori: ["Villa Pantai", "Villa Eksklusif"],
        fasilitas: [
          "Kamar 4",
          "K. Mandi 3",
          "Kolam Renang",
          "AC",
          "WiFi",
          "Dapur Modern",
        ],
        harga: 2500000,
        status: "success",
      },
      {
        nama: "Villa Sunrise Bliss",
        deskripsi:
          "Villa yang indah dengan pemandangan matahari terbit langsung dari kamar.",
        lokasi: "Ubud, Bali, Indonesia",
        kategori: ["Villa Romantis", "Dekat Alam"],
        fasilitas: [
          "Kamar 2",
          "K. Mandi 1",
          "Kolam Renang Pribadi",
          "WiFi Gratis",
        ],
        harga: 1800000,
        status: "success",
      },
      {
        nama: "Villa Serenity Hills",
        deskripsi:
          "Villa di atas bukit dengan udara segar dan pemandangan spektakuler.",
        lokasi: "Puncak, Bogor, Indonesia",
        kategori: ["Villa Murah", "Pemandangan Gunung"],
        fasilitas: ["Kamar 3", "K. Mandi 2", "Teras Besar", "Parkir Luas"],
        harga: 1200000,
        status: "success",
      },
      {
        nama: "Villa Ocean Breeze",
        deskripsi: "Villa nyaman di tepi pantai dengan akses langsung ke laut.",
        lokasi: "Kuta, Lombok, Indonesia",
        kategori: ["Villa Tropis", "Dekat Pantai"],
        fasilitas: ["Kamar 4", "K. Mandi 3", "Dapur Lengkap", "Kolam Renang"],
        harga: 2500000,
        status: "success",
      },
      {
        nama: "Villa Eco Retreat",
        deskripsi: "Villa ramah lingkungan yang dikelilingi hutan hijau.",
        lokasi: "Bandung, Jawa Barat, Indonesia",
        kategori: ["Villa Alam", "Eco-Friendly"],
        fasilitas: [
          "Kamar 2",
          "K. Mandi 1",
          "Taman Pribadi",
          "Kamar Mandi Terbuka",
        ],
        harga: 1400000,
        status: "success",
      },
      {
        nama: "Villa Luxora",
        deskripsi:
          "Villa modern dengan desain minimalis dan fasilitas lengkap.",
        lokasi: "Jakarta, Indonesia",
        kategori: ["Villa Eksklusif", "Dekat Kota"],
        fasilitas: [
          "Kamar 5",
          "K. Mandi 4",
          "Rooftop View",
          "Smart Home System",
        ],
        harga: 3000000,
        status: "success",
      },
      {
        nama: "Villa Gardenia",
        deskripsi: "Villa cantik dengan taman bunga luas dan suasana tenang.",
        lokasi: "Malang, Jawa Timur, Indonesia",
        kategori: ["Villa Romantis", "Dekat Alam"],
        fasilitas: ["Kamar 3", "K. Mandi 2", "Area Barbeque", "Kolam Renang"],
        harga: 1900000,
        status: "success",
      },
      {
        nama: "Villa Tropical Haven",
        deskripsi: "Villa tropis dengan gazebo santai dan pemandangan hijau.",
        lokasi: "Bali, Indonesia",
        kategori: ["Villa Tropis", "Dekat Alam"],
        fasilitas: ["Kamar 4", "K. Mandi 3", "Dapur Lengkap", "Kolam Renang"],
        harga: 2100000,
        status: "success",
      },
      {
        nama: "Villa Mountain Bliss",
        deskripsi:
          "Villa di kaki gunung dengan udara segar dan pemandangan hijau.",
        lokasi: "Semarang, Jawa Tengah, Indonesia",
        kategori: ["Villa Murah", "Pemandangan Gunung"],
        fasilitas: ["Kamar 3", "K. Mandi 2", "Teras Besar", "WiFi Gratis"],
        harga: 1700000,
        status: "success",
      },
      {
        nama: "Villa Royal Cove",
        deskripsi: "Villa mewah dengan desain elegan dan fasilitas eksklusif.",
        lokasi: "Surabaya, Jawa Timur, Indonesia",
        kategori: ["Villa Eksklusif", "Dekat Kota"],
        fasilitas: ["Kamar 5", "K. Mandi 4", "Ruang Teater", "Kolam Renang"],
        harga: 3500000,
        status: "success",
      },
      {
        nama: "Villa Harmony",
        deskripsi: "Villa dengan suasana damai dan akses mudah ke pusat kota.",
        lokasi: "Denpasar, Bali, Indonesia",
        kategori: ["Villa Murah", "Dekat Kota"],
        fasilitas: ["Kamar 2", "K. Mandi 1", "Dapur Mini", "WiFi Gratis"],
        harga: 1100000,
        status: "success",
      },
    ];

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
