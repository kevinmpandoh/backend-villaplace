// seeders/userSeeder.ts
import User from "../models/user";
import bcrypt from "bcrypt";

const userSeeder = async () => {
  try {
    const deleteResult = await User.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} user(s)`);

    // Data user baru untuk diinsert
    const users = [
      {
        nama: "Kevin",
        email: "keivn@gmail.com",
        password: await bcrypt.hash("password", 10), // Hashing password
        no_telepon: "081234567890",
      },
      {
        nama: "Fery",
        email: "fery@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "081987654321",
      },
      {
        nama: "Denti",
        email: "denti@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "081234517892",
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
