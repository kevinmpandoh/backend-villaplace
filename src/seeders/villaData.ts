const villaData = [
  {
    nama: "Villa Sunrise Bliss",
    deskripsi:
      "Villa yang indah dengan pemandangan matahari terbit langsung dari kamar.",
    lokasi: "Ubud, Bali, Indonesia",
    kategori: ["Villa Romantis", "Dekat Alam"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Kolam Renang", "WiFi", "AC"],
    harga: 1800000,
    status: "success",
  },
  {
    nama: "Villa Serenity Hills",
    deskripsi:
      "Villa di atas bukit dengan udara segar dan pemandangan spektakuler.",
    lokasi: "Puncak, Bogor, Indonesia",
    kategori: ["Villa Murah", "Pemandangan Gunung"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "Parkir", "Kloset Duduk", "BBQ"],
    harga: 1200000,
    status: "success",
  },
  {
    nama: "Villa Ocean Breeze",
    deskripsi: "Villa nyaman di tepi pantai dengan akses langsung ke laut.",
    lokasi: "Kuta, Lombok, Indonesia",
    kategori: ["Villa Tropis", "Dekat Pantai"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "TV", "Kompor", "Kolam Renang"],
    harga: 2500000,
    status: "success",
  },
  {
    nama: "Villa Eco Retreat",
    deskripsi: "Villa ramah lingkungan yang dikelilingi hutan hijau.",
    lokasi: "Bandung, Jawa Barat, Indonesia",
    kategori: ["Villa Alam", "Eco-Friendly"],
    fasilitas: ["Kamar 1", "K. Mandi 1", "Air Panas", "WiFi", "Parkir"],
    harga: 1400000,
    status: "success",
  },
  {
    nama: "Villa Luxora",
    deskripsi: "Villa modern dengan desain minimalis dan fasilitas lengkap.",
    lokasi: "Jakarta, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Kota"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "AC", "Air Panas", "WiFi"],
    harga: 3000000,
    status: "success",
  },
  {
    nama: "Villa Gardenia",
    deskripsi: "Villa cantik dengan taman bunga luas dan suasana tenang.",
    lokasi: "Malang, Jawa Timur, Indonesia",
    kategori: ["Villa Romantis", "Dekat Alam"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "BBQ", "Parkir", "Kompor"],
    harga: 1900000,
    status: "success",
  },
  {
    nama: "Villa Tropical Haven",
    deskripsi: "Villa tropis dengan gazebo santai dan pemandangan hijau.",
    lokasi: "Bali, Indonesia",
    kategori: ["Villa Tropis", "Dekat Alam"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "TV", "Kolam Renang", "AC"],
    harga: 2100000,
    status: "success",
  },
  {
    nama: "Villa Mountain Bliss",
    deskripsi: "Villa di kaki gunung dengan udara segar dan pemandangan hijau.",
    lokasi: "Semarang, Jawa Tengah, Indonesia",
    kategori: ["Villa Murah", "Pemandangan Gunung"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "Parkir", "Air Panas", "WiFi"],
    harga: 1700000,
    status: "success",
  },
  {
    nama: "Villa Royal Cove",
    deskripsi: "Villa mewah dengan desain elegan dan fasilitas eksklusif.",
    lokasi: "Surabaya, Jawa Timur, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Kota"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "BBQ", "AC", "Kolam Renang"],
    harga: 3500000,
    status: "success",
  },
  {
    nama: "Villa Harmony",
    deskripsi: "Villa dengan suasana damai dan akses mudah ke pusat kota.",
    lokasi: "Denpasar, Bali, Indonesia",
    kategori: ["Villa Murah", "Dekat Kota"],
    fasilitas: ["Kamar 1", "K. Mandi 1", "Kompor", "Air Panas", "Kloset Duduk"],
    harga: 1100000,
    status: "success",
  },
  {
    nama: "Villa Paradise View",
    deskripsi: "Villa dengan pemandangan tepi pantai yang memukau.",
    lokasi: "Manado, Sulawesi Utara, Indonesia",
    kategori: ["Villa Tropis", "Dekat Pantai"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Kolam Renang", "BBQ", "AC"],
    harga: 2400000,
    status: "success",
  },
  {
    nama: "Villa Aurora Peaks",
    deskripsi: "Villa eksklusif di pegunungan dengan udara sejuk.",
    lokasi: "Bandung, Jawa Barat, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Alam"],
    fasilitas: ["Kamar 5", "K. Mandi 3", "TV", "Parkir", "WiFi"],
    harga: 3000000,
    status: "success",
  },
  {
    nama: "Villa Tranquil Escape",
    deskripsi: "Villa yang tenang dan nyaman untuk liburan keluarga.",
    lokasi: "Yogyakarta, Indonesia",
    kategori: ["Villa Murah", "Dekat Kota"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "Kloset Duduk", "AC", "Kompor"],
    harga: 1500000,
    status: "success",
  },
  {
    nama: "Villa Desert Rose",
    deskripsi: "Villa eksotis dengan desain ala Timur Tengah.",
    lokasi: "Surabaya, Jawa Timur, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Kota"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "Kolam Renang", "BBQ", "WiFi"],
    harga: 3200000,
    status: "success",
  },
  {
    nama: "Villa Palm Grove",
    deskripsi: "Villa tropis dengan suasana nyaman dikelilingi pohon kelapa.",
    lokasi: "Lombok, Indonesia",
    kategori: ["Villa Tropis", "Dekat Pantai"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Kolam Renang", "AC", "WiFi"],
    harga: 2000000,
    status: "success",
  },
  {
    nama: "Villa Sunset Charm",
    deskripsi:
      "Villa dengan pemandangan matahari terbenam langsung dari teras.",
    lokasi: "Jimbaran, Bali, Indonesia",
    kategori: ["Villa Romantis", "Dekat Alam"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "BBQ", "Air Panas", "Parkir"],
    harga: 2200000,
    status: "success",
  },
  {
    nama: "Villa Cliffside Retreat",
    deskripsi: "Villa yang terletak di tepi tebing dengan pemandangan laut.",
    lokasi: "Nusa Penida, Bali, Indonesia",
    kategori: ["Villa Tropis", "Dekat Pantai"],
    fasilitas: [
      "Kamar 4",
      "K. Mandi 3",
      "WiFi",
      "Kolam Renang",
      "Kloset Duduk",
    ],
    harga: 2700000,
    status: "success",
  },
  {
    nama: "Villa Sakura Bliss",
    deskripsi: "Villa dengan taman bunga sakura yang menawan.",
    lokasi: "Malang, Jawa Timur, Indonesia",
    kategori: ["Villa Romantis", "Dekat Alam"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Kompor", "Air Panas", "AC"],
    harga: 1600000,
    status: "success",
  },
  {
    nama: "Villa Forest Haven",
    deskripsi: "Villa yang dikelilingi hutan hijau dengan udara segar.",
    lokasi: "Bogor, Jawa Barat, Indonesia",
    kategori: ["Villa Alam", "Eco-Friendly"],
    fasilitas: ["Kamar 1", "K. Mandi 1", "TV", "Parkir", "BBQ"],
    harga: 1300000,
    status: "success",
  },
  {
    nama: "Villa Aqua Blue",
    deskripsi: "Villa modern dengan kolam renang infinity menghadap laut.",
    lokasi: "Kuta, Bali, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Pantai"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "Kolam Renang", "WiFi", "AC"],
    harga: 3200000,
    status: "success",
  },
  {
    nama: "Villa Zen Harmony",
    deskripsi: "Villa bergaya Jepang dengan taman meditasi dan kolam koi.",
    lokasi: "Bandung, Jawa Barat, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Kota"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Air Panas", "WiFi", "Kloset Duduk"],
    harga: 1900000,
    status: "success",
  },
  {
    nama: "Villa Rustic Charm",
    deskripsi: "Villa bergaya pedesaan dengan interior kayu yang hangat.",
    lokasi: "Canggu, Bali, Indonesia",
    kategori: ["Villa Tropis", "Dekat Alam"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "BBQ", "Parkir", "Kompor"],
    harga: 2100000,
    status: "success",
  },
  {
    nama: "Villa Modern Luxe",
    deskripsi: "Villa dengan desain modern dan fasilitas premium.",
    lokasi: "Jakarta, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Kota"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "Kolam Renang", "AC", "TV"],
    harga: 3500000,
    status: "success",
  },
  {
    nama: "Villa Ocean Pearl",
    deskripsi: "Villa di pinggir pantai dengan pasir putih yang memikat.",
    lokasi: "Gili Trawangan, Lombok, Indonesia",
    kategori: ["Villa Tropis", "Dekat Pantai"],
    fasilitas: [
      "Kamar 2",
      "K. Mandi 1",
      "WiFi",
      "Kolam Renang",
      "Kloset Duduk",
    ],
    harga: 2300000,
    status: "success",
  },
  {
    nama: "Villa Crystal Bay",
    deskripsi: "Villa dengan pemandangan teluk biru jernih dan privasi tinggi.",
    lokasi: "Karimunjawa, Jawa Tengah, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Pantai"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "Kompor", "Air Panas", "BBQ"],
    harga: 2600000,
    status: "success",
  },
  {
    nama: "Villa Cloud Nine",
    deskripsi: "Villa dengan lokasi di puncak bukit dan pemandangan awan.",
    lokasi: "Bromo, Jawa Timur, Indonesia",
    kategori: ["Villa Romantis", "Dekat Alam"],
    fasilitas: ["Kamar 1", "K. Mandi 1", "Parkir", "Air Panas", "WiFi"],
    harga: 1400000,
    status: "success",
  },
  {
    nama: "Villa Dreamscape",
    deskripsi: "Villa dengan pemandangan 360 derajat pantai dan pegunungan.",
    lokasi: "Raja Ampat, Papua Barat, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Pantai"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "Kolam Renang", "WiFi", "AC"],
    harga: 4000000,
    status: "success",
  },
  {
    nama: "Villa Serenity Point",
    deskripsi:
      "Villa di tepi danau dengan suasana damai dan relaksasi maksimal.",
    lokasi: "Toba, Sumatera Utara, Indonesia",
    kategori: ["Villa Alam", "Dekat Air"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "TV", "Parkir", "Kolam Renang"],
    harga: 1800000,
    status: "success",
  },
  {
    nama: "Villa Pine Hill",
    deskripsi:
      "Villa yang dikelilingi pohon pinus dengan udara segar dan tenang.",
    lokasi: "Lembang, Bandung, Indonesia",
    kategori: ["Villa Alam", "Dekat Kota"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "BBQ", "WiFi", "Parkir"],
    harga: 1800000,
    status: "success",
  },
  {
    nama: "Villa Crystal Lagoon",
    deskripsi: "Villa dengan laguna pribadi dan area outdoor luas.",
    lokasi: "Batam, Kepulauan Riau, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Pantai"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "Kolam Renang", "AC", "Kloset Duduk"],
    harga: 2500000,
    status: "success",
  },
  {
    nama: "Villa Orchid Paradise",
    deskripsi: "Villa dengan taman anggrek yang indah dan nyaman.",
    lokasi: "Batu, Jawa Timur, Indonesia",
    kategori: ["Villa Tropis", "Dekat Alam"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Kompor", "Air Panas", "WiFi"],
    harga: 1500000,
    status: "success",
  },
  {
    nama: "Villa Blue Horizon",
    deskripsi: "Villa dengan pemandangan laut biru yang memukau.",
    lokasi: "Labuan Bajo, Flores, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Pantai"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "Kolam Renang", "AC", "WiFi"],
    harga: 3000000,
    status: "success",
  },
  {
    nama: "Villa Bamboo Grove",
    deskripsi: "Villa bergaya tradisional dengan taman bambu yang teduh.",
    lokasi: "Yogyakarta, Indonesia",
    kategori: ["Villa Tropis", "Dekat Kota"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Parkir", "BBQ", "Kompor"],
    harga: 1300000,
    status: "success",
  },
  {
    nama: "Villa Coral Reef",
    deskripsi: "Villa di tepi pantai dengan snorkeling langsung dari halaman.",
    lokasi: "Bunaken, Sulawesi Utara, Indonesia",
    kategori: ["Villa Tropis", "Dekat Pantai"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "WiFi", "AC", "Air Panas"],
    harga: 3500000,
    status: "success",
  },
  {
    nama: "Villa Sunset View",
    deskripsi: "Villa dengan pemandangan matahari terbenam dari rooftop.",
    lokasi: "Sanur, Bali, Indonesia",
    kategori: ["Villa Romantis", "Dekat Pantai"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "TV", "Parkir", "WiFi"],
    harga: 2000000,
    status: "success",
  },
  {
    nama: "Villa Lavender Fields",
    deskripsi: "Villa dengan taman bunga lavender yang luas dan menenangkan.",
    lokasi: "Garut, Jawa Barat, Indonesia",
    kategori: ["Villa Alam", "Dekat Kota"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Air Panas", "WiFi", "Kloset Duduk"],
    harga: 1400000,
    status: "success",
  },
  {
    nama: "Villa Mystic River",
    deskripsi: "Villa di tepi sungai dengan suasana tenang dan privat.",
    lokasi: "Ubud, Bali, Indonesia",
    kategori: ["Villa Alam", "Dekat Alam"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "Kolam Renang", "AC", "BBQ"],
    harga: 2800000,
    status: "success",
  },
  {
    nama: "Villa Snowy Peak",
    deskripsi: "Villa di kaki gunung dengan suasana dingin dan sejuk.",
    lokasi: "Puncak, Jawa Barat, Indonesia",
    kategori: ["Villa Tropis", "Dekat Gunung"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Parkir", "Kompor", "Air Panas"],
    harga: 1200000,
    status: "success",
  },
  {
    nama: "Villa Emerald Bay",
    deskripsi: "Villa dengan desain modern di dekat pantai yang indah.",
    lokasi: "Kuta, Bali, Indonesia",
    kategori: ["Villa Modern", "Dekat Pantai"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "Kolam Renang", "AC", "WiFi"],
    harga: 2200000,
    status: "pending",
  },
  {
    nama: "Villa Tranquil Woods",
    deskripsi: "Villa yang dikelilingi hutan untuk privasi maksimal.",
    lokasi: "Bogor, Jawa Barat, Indonesia",
    kategori: ["Villa Alam", "Dekat Gunung"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Air Panas", "Parkir", "BBQ"],
    harga: 1300000,
    status: "rejected",
  },
  {
    nama: "Villa Golden Horizon",
    deskripsi: "Villa dengan pemandangan laut luas dan fasilitas lengkap.",
    lokasi: "Manado, Sulawesi Utara, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Pantai"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "TV", "Kolam Renang", "WiFi"],
    harga: 2900000,
    status: "pending",
  },
  {
    nama: "Villa Cozy Breeze",
    deskripsi: "Villa minimalis dengan udara segar di pegunungan.",
    lokasi: "Malang, Jawa Timur, Indonesia",
    kategori: ["Villa Tropis", "Dekat Kota"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Parkir", "Air Panas", "AC"],
    harga: 1400000,
    status: "rejected",
  },
  {
    nama: "Villa Ocean Serenity",
    deskripsi: "Villa di tepi pantai yang cocok untuk liburan keluarga.",
    lokasi: "Belitung, Kepulauan Bangka Belitung, Indonesia",
    kategori: ["Villa Alam", "Dekat Pantai"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "WiFi", "Kompor", "BBQ"],
    harga: 1800000,
    status: "pending",
  },
  {
    nama: "Villa Green Terrace",
    deskripsi: "Villa dengan taman hijau yang luas dan area outdoor.",
    lokasi: "Semarang, Jawa Tengah, Indonesia",
    kategori: ["Villa Tropis", "Dekat Kota"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "TV", "Parkir", "Kloset Duduk"],
    harga: 1700000,
    status: "rejected",
  },
  {
    nama: "Villa Sky Ridge",
    deskripsi: "Villa dengan pemandangan pegunungan dan udara dingin.",
    lokasi: "Bandung, Jawa Barat, Indonesia",
    kategori: ["Villa Tropis", "Dekat Gunung"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Air Panas", "Kolam Renang", "BBQ"],
    harga: 1500000,
    status: "pending",
  },
  {
    nama: "Villa Blissful Shore",
    deskripsi: "Villa di dekat pantai dengan desain tropis modern.",
    lokasi: "Lombok, Nusa Tenggara Barat, Indonesia",
    kategori: ["Villa Eksklusif", "Dekat Pantai"],
    fasilitas: ["Kamar 4", "K. Mandi 3", "WiFi", "Parkir", "Air Panas"],
    harga: 2500000,
    status: "rejected",
  },
  {
    nama: "Villa Amber Sunset",
    deskripsi: "Villa dengan rooftop untuk menikmati pemandangan sunset.",
    lokasi: "Makassar, Sulawesi Selatan, Indonesia",
    kategori: ["Villa Romantis", "Dekat Kota"],
    fasilitas: ["Kamar 3", "K. Mandi 2", "Kompor", "TV", "AC"],
    harga: 2000000,
    status: "pending",
  },
  {
    nama: "Villa Highland Retreat",
    deskripsi: "Villa terpencil dengan pemandangan pegunungan indah.",
    lokasi: "Cianjur, Jawa Barat, Indonesia",
    kategori: ["Villa Tropis", "Dekat Gunung"],
    fasilitas: ["Kamar 2", "K. Mandi 1", "Parkir", "Air Panas", "WiFi"],
    harga: 1600000,
    status: "rejected",
  },
];

export default villaData;
