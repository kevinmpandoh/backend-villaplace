// seeders/userSeeder.ts
import User from "../models/userModel";
import bcrypt from "bcrypt";

const userSeeder = async () => {
  try {
    const deleteResult = await User.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} user(s)`);

    // Data user baru untuk diinsert
    const users = [
      {
        nama: "Kevin",
        email: "kevin@gmail.com",
        password: await bcrypt.hash("password", 10), // Hashing password
        no_telepon: "0281234567890",
      },
      {
        nama: "Fery",
        email: "fery@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "0812987654321",
      },
      {
        nama: "Denti",
        email: "denti@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "0815234517892",
      },
    ];

    // Menambahkan data user baru ke database
    await User.insertMany(users);
    console.log("User seeder completed successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

export default userSeeder;
