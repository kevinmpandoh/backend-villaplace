import { Favorite } from "../models/Favorite";
import User from "../models/userModel";
import { Villa } from "../models/villaModel";

const favoriteSeeder = async () => {
  console.log("Seeding Favorites...");

  try {
    await Favorite.deleteMany({});
    // Ambil semua pengguna dan villa dari database
    const users = await User.find();
    const villas = await Villa.find();

    if (users.length === 0 || villas.length === 0) {
      console.log("No users or villas found to create favorites.");
      return;
    }

    const favoriteData = [] as any;

    // Buat data favorit secara acak
    users.forEach((user) => {
      // Set jumlah villa favorit per pengguna (misalnya antara 1-5)
      const numFavorites = Math.floor(Math.random() * 5) + 1;

      // Pilih villa secara acak tanpa duplikasi
      const selectedVillas = [
        ...new Set(
          Array.from(
            { length: numFavorites },
            () => villas[Math.floor(Math.random() * villas.length)]._id
          )
        ),
      ];

      selectedVillas.forEach((villaId) => {
        favoriteData.push({
          user: user._id,
          villa: villaId,
        });
      });
    });

    // Masukkan data favorit ke database
    await Favorite.insertMany(favoriteData);
    console.log("Favorites seeded successfully!");
  } catch (error) {
    console.error("Error seeding favorites:", error);
  }
};

export default favoriteSeeder;
