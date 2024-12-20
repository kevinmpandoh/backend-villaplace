// seeders/userSeeder.ts
import { Admin } from "../models/adminModel";
import bcrypt from "bcrypt";

const adminSeeder = async () => {
  try {
    const deleteResult = await Admin.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} admin(s)`);

    // Data user baru untuk diinsert
    const users = [
      {
        nama: "Kevin Admin",
        email: "kevin@gmail.com",
        password: await bcrypt.hash("password", 10), // Hashing password
      },
      {
        nama: "Fery Admin",
        email: "fery@gmail.com",
        password: await bcrypt.hash("password", 10),
      },
      {
        nama: "Denti Admin",
        email: "denti@gmail.com",
        password: await bcrypt.hash("password", 10),
      },
      {
        nama: "Azkal Admin",
        email: "azkal@gmail.com",
        password: await bcrypt.hash("password", 10),
      },
      {
        nama: "Maria Admin",
        email: "maria@gmail.com",
        password: await bcrypt.hash("password", 10),
      },
    ];

    // Menambahkan data user baru ke database
    await Admin.insertMany(users);
    console.log("Admin seeder completed successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

export default adminSeeder;
