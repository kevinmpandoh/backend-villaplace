// seeders/userSeeder.ts
import User from "../models/ownerModel";
import bcrypt from "bcrypt";

const ownerSeeder = async () => {
  try {
    const deleteResult = await User.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} owner(s)`);

    // Data user baru untuk diinsert
    const users = [
      {
        nama: "Kevin Owner",
        email: "kevin@gmail.com",
        password: await bcrypt.hash("password", 10), // Hashing password
        no_telepon: "081234567890",
      },
      {
        nama: "Fery Owner",
        email: "fery@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "081987654321",
      },
      {
        nama: "Denti Owner",
        email: "denti@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "081234563890",
      },
    ];

    // Menambahkan data user baru ke database
    await User.insertMany(users);
    console.log("User seeder completed successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

export default ownerSeeder;
