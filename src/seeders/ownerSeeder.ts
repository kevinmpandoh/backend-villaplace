// seeders/userSeeder.ts
import Owner from "../models/ownerModel";
import bcrypt from "bcrypt";

const ownerSeeder = async () => {
  try {
    const deleteResult = await Owner.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} owner(s)`);

    // Data user baru untuk diinsert
    const owners = [
      {
        nama: "Kevin Owner",
        email: "kevin@gmail.com",
        password: await bcrypt.hash("password", 10), // Hashing password
        no_telepon: "0812345637890",
      },
      {
        nama: "Fery Owner",
        email: "fery@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "0819876542321",
      },
      {
        nama: "Denti Owner",
        email: "denti@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "0812345663890",
      },
      {
        nama: "Azkal Owner",
        email: "azkal@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "0812343567890",
      },
      {
        nama: "Maria Owner",
        email: "maria@gmail.com",
        password: await bcrypt.hash("password", 10),
        no_telepon: "0812345767890",
      },
    ];

    // Menambahkan data user baru ke database
    await Owner.insertMany(owners);
    console.log("User seeder completed successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

export default ownerSeeder;
