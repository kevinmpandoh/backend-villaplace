import { Ulasan } from "../models/Ulasan";
import { Pesanan } from "../models/pesananModel";
import User from "../models/userModel";
import { Villa } from "../models/villaModel";

const ulasanSeeder = async () => {
  console.log("Seeding Ulasan...");

  try {
    // Hapus data lama
    await Ulasan.deleteMany({});
    console.log("Existing Ulasan deleted.");

    // Ambil data pesanan dengan status "completed"
    const completedPesanan = await Pesanan.find({
      status: "completed",
    }).populate(["villa", "user"]);

    if (!completedPesanan.length) {
      console.log("No completed Pesanan found to create Ulasan.");
      return;
    }

    // Komentar berdasarkan rating
    const komentarNegatif = [
      "Villanya kotor dan tidak terawat.",
      "Pelayanan buruk dan tidak ramah.",
      "Fasilitas yang dijanjikan tidak ada.",
      "Lokasi sulit ditemukan dan jauh dari pusat kota.",
      "Banyak masalah dengan kebersihan kamar.",
      "Air panas tidak berfungsi.",
      "Lampu mati beberapa kali selama menginap.",
      "Harga tidak sebanding dengan kualitas.",
      "Kamar sempit dan tidak sesuai deskripsi.",
      "Sangat berisik, sulit untuk beristirahat.",
      "Toilet rusak dan tidak diperbaiki.",
      "Parkir sangat terbatas dan tidak nyaman.",
      "Pemandangan buruk, tidak sesuai foto.",
      "Proses check-in sangat lambat.",
      "Villanya gelap dan terasa tidak aman.",
      "Staf tidak membantu saat ada keluhan.",
      "Air sering mati, tidak nyaman.",
      "AC tidak berfungsi dengan baik.",
      "Kolam renang kotor dan tidak layak pakai.",
      "Sarapan sangat buruk, tidak layak.",
    ];

    const komentarNetral = [
      "Villanya cukup baik, meskipun ada kekurangan.",
      "Lokasi strategis, tapi fasilitas biasa saja.",
      "Harga sepadan dengan kualitas yang ditawarkan.",
      "Pengalaman menginap yang standar, tidak terlalu istimewa.",
      "Villanya lumayan, tapi perlu perbaikan di beberapa area.",
      "Kamar sesuai deskripsi, tapi tidak ada tambahan spesial.",
      "Pelayanan biasa saja, tidak terlalu buruk.",
      "Fasilitas sesuai harga, tapi tidak ada kelebihan.",
      "Villanya oke untuk harga yang ditawarkan.",
      "Tempatnya lumayan nyaman, meskipun sederhana.",
      "Lokasinya dekat dengan tempat wisata, cukup memudahkan.",
      "Check-in dan check-out lancar tanpa masalah.",
      "Kondisi kamar cukup bersih, meskipun ada kekurangan kecil.",
      "Villanya cocok untuk perjalanan singkat.",
      "Pengalaman menginap netral, tidak ada masalah berarti.",
      "Villanya cukup luas, tapi kurang dekorasi.",
      "Pelayanan cukup baik, meskipun tidak luar biasa.",
      "Pemandangan biasa saja, sesuai ekspektasi.",
      "Kondisi kamar sesuai standar, cukup baik.",
      "Kolam renang bersih, tapi tidak terlalu besar.",
    ];

    const komentarPositif = [
      "Villanya sangat nyaman dan bersih!",
      "Pengalaman menginap yang luar biasa.",
      "Staf sangat ramah dan membantu.",
      "Fasilitas lengkap dan sesuai deskripsi.",
      "Harga terjangkau dengan kualitas yang bagus.",
      "Lokasi strategis, dekat dengan tempat wisata.",
      "Pemandangan indah, sangat memuaskan.",
      "Villanya luas dan cocok untuk keluarga.",
      "Kamar sangat bersih dan nyaman.",
      "Pelayanan cepat dan efisien.",
      "Kolam renang bersih dan menyenangkan.",
      "Dekorasi villa sangat menarik dan modern.",
      "Sarapan enak dan variatif.",
      "Proses check-in sangat mudah dan cepat.",
      "Villanya terasa seperti rumah sendiri.",
      "Lingkungan villa sangat tenang dan asri.",
      "Parkir luas dan aman.",
      "Air panas berfungsi dengan baik, sangat nyaman.",
      "Villanya melebihi ekspektasi saya!",
      "Sangat direkomendasikan untuk liburan keluarga.",
    ];

    const ulasanData = [] as any;
    completedPesanan.forEach((pesanan) => {
      const randomRating = Math.floor(Math.random() * 5) + 1; // Rating 1-5

      let randomKomentar;
      if (randomRating <= 2) {
        randomKomentar =
          komentarNegatif[Math.floor(Math.random() * komentarNegatif.length)];
      } else if (randomRating === 3) {
        randomKomentar =
          komentarNetral[Math.floor(Math.random() * komentarNetral.length)];
      } else {
        randomKomentar =
          komentarPositif[Math.floor(Math.random() * komentarPositif.length)];
      }

      ulasanData.push({
        komentar: randomKomentar,
        rating: randomRating,
        user: pesanan.user,
        villa: pesanan.villa,
        pesanan: pesanan._id,
      });
    });

    // Simpan ulasan
    const ulasan = await Ulasan.insertMany(ulasanData);
    console.log(`Created ${ulasan.length} Ulasan.`);
  } catch (error) {
    console.error("Error seeding Ulasan:", error);
  }
};

export default ulasanSeeder;
