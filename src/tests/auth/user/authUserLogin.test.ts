import request from "supertest";
import app from "../../../app"; // Pastikan app adalah instance Express
import User from "../../../models/userModel"; // Mock ini
import bcrypt from "bcrypt"; // Mock ini
import jwt from "jsonwebtoken"; // Mock ini

jest.mock("../../../models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";

describe("Login User Controller", () => {
  const mockUser = {
    _id: "user123",
    nama: "Test User",
    email: "test@example.com",
    no_telepon: "081234567890",
    foto_profile: "profile.jpg",
    password: "hashedpassword",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if email is missing", async () => {
    const response = await request(app).post("/api/auth/user/login").send({
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty("email");
    expect(response.body.errors.email).toBe("Email harus diisi!");
  });

  it("should return 400 if password is missing", async () => {
    const response = await request(app).post("/api/auth/user/login").send({
      email: "test@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty("password");
    expect(response.body.errors.password).toBe("Password harus diisi!");
  });

  it("should return 400 if email is not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const response = await request(app).post("/api/auth/user/login").send({
      email: "notfound@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty("email");
    expect(response.body.errors.email).toBe("Email tidak ditemukan!");
  });

  it("should return 400 if password is incorrect", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await request(app).post("/api/auth/user/login").send({
      email: mockUser.email,
      password: "wrongpassword",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty("password");
    expect(response.body.errors.password).toBe(
      "Password yang Anda masukkan salah!"
    );
  });

  it("should return 200 and token if login is successful", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocked-token");

    const response = await request(app).post("/api/auth/user/login").send({
      email: mockUser.email,
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "Success");
    expect(response.body).toHaveProperty("token", "mocked-token");
    expect(response.body).toHaveProperty("message", "Berhasil login");
  });

  it("should return 500 if server error occurs", async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/api/auth/user/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", "Failed");
    expect(response.body.errors).toHaveProperty("server");
    expect(response.body.errors.server).toBe("Error pada server");
  });
});
