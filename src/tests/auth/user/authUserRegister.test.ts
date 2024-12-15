import request from "supertest";
import mongoose from "mongoose";
import app from "../../../app"; // Path ke file Express utama Anda
import User from "../../../models/userModel"; // Path ke model User Anda

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

describe("Authentication - Register Endpoint", () => {
  // Jalankan koneksi database
  beforeAll(async () => {
    await mongoose.connect(`${MONGO_URI}/test`);
  });

  // Tutup koneksi database setelah test selesai
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  // Hapus semua data sebelum setiap test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should register a user successfully", async () => {
    const userData = {
      nama: "John Doe",
      email: "john@example.com",
      password: "password123",
      no_telepon: "081234567890",
    };

    const res = await request(app)
      .post("/api/auth/user/register")
      .send(userData);

    // Validasi respons
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("Success");
    expect(res.body.message).toBe("User berhasil dibuat");
    expect(res.body.data).toHaveProperty("nama", userData.nama);
    expect(res.body.data).toHaveProperty("email", userData.email);
    expect(res.body.data).toHaveProperty("no_telepon", userData.no_telepon);

    // Validasi penyimpanan ke database
    const userInDb = await User.findOne({ email: userData.email });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.nama).toBe(userData.nama);
    expect(userInDb?.email).toBe(userData.email);
  });

  it("should fail if email is already in use", async () => {
    const existingUser = new User({
      nama: "Jane Doe",
      email: "jane@example.com",
      password: "hashedpassword",
      no_telepon: "081234567891",
    });
    await existingUser.save();

    const newUserData = {
      nama: "John Doe",
      email: "jane@example.com",
      password: "password123",
      no_telepon: "081234567892",
    };

    const res = await request(app)
      .post("/api/auth/user/register")
      .send(newUserData);

    // Validasi respons
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("Failed");
    expect(res.body.errors.email).toBe("Email sudah digunakan oleh user lain!");
  });

  it("should fail if no_telepon is already in use", async () => {
    const existingUser = new User({
      nama: "Jane Doe",
      email: "jane2@example.com",
      password: "hashedpassword",
      no_telepon: "081234567891",
    });
    await existingUser.save();

    const newUserData = {
      nama: "John Doe",
      email: "john2@example.com",
      password: "password123",
      no_telepon: "081234567891",
    };

    const res = await request(app)
      .post("/api/auth/user/register")
      .send(newUserData);

    // Validasi respons
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("Failed");
    expect(res.body.errors.no_telepon).toBe(
      "Nomor telepon sudah digunakan oleh user lain!"
    );
  });

  it("should fail if required fields are missing", async () => {
    const invalidData = {
      nama: "",
      email: "",
      password: "",
      no_telepon: "",
    };

    const res = await request(app)
      .post("/api/auth/user/register")
      .send(invalidData);

    // Validasi respons
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("Failed");
    expect(res.body.errors.nama).toBe("Nama harus diisi!");
    expect(res.body.errors.email).toBe("Email harus diisi!");
    expect(res.body.errors.password).toBe("Password harus diisi!");
    expect(res.body.errors.no_telepon).toBe("Nomor telepon harus diisi!");
  });

  it("should fail if password is less than 8 characters", async () => {
    const invalidData = {
      nama: "John Doe",
      email: "john@example.com",
      password: "123",
      no_telepon: "081234567890",
    };

    const res = await request(app)
      .post("/api/auth/user/register")
      .send(invalidData);

    // Validasi respons
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("Failed");
    expect(res.body.errors.password).toBe(
      "Password harus memiliki minimal 8 karakter!"
    );
  });
});
