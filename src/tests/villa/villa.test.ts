import request from "supertest";
import app from "../../app"; // Import instance aplikasi Express.js
import { Villa } from "../../models/villaModel"; // Import model Villa
import { Ulasan } from "../../models/Ulasan";
import Owner from "../../models/ownerModel";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

jest.mock("../../models/villaModel"); // Mocking model Villa
jest.mock("../../models/Ulasan"); // Mocking model Ulasan

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://username:password@cluster0.mongodb.net/test";

// describe('GET /villas', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should return a list of villas with correct pagination and additional data', async () => {
//     const mockVillas = [
//       {
//         _id: '1',
//         nama: 'Villa A',
//         lokasi: 'Bali',
//         harga: 1000000,
//         kategori: ['luxury'],
//         status: 'success',
//         pemilik_villa: {},
//         foto_villa: [],
//       },
//     ];

//     const mockUlasans = [
//       { rating: 5 },
//       { rating: 4 },
//     ];

//     // Mock database methods
//     Villa.find.mockResolvedValue(mockVillas);
//     Villa.countDocuments.mockResolvedValue(1);
//     Ulasan.find.mockResolvedValue(mockUlasans);

//     const response = await request(app)
//       .get('/villas')
//       .query({ page: 1, limit: 1 });

//     expect(response.status).toBe(200);
//     expect(response.body.status).toBe('success');
//     expect(response.body.data).toEqual([
//       expect.objectContaining({
//         nama: 'Villa A',
//         averageRating: 4.5,
//         commentCount: 2,
//       }),
//     ]);
//     expect(response.body.pagination).toEqual(
//       expect.objectContaining({
//         totalVillas: 1,
//         totalPages: 1,
//         currentPage: 1,
//         limit: 1,
//       }),
//     );
//   });

//   it('should return filtered villas based on query parameters', async () => {
//     const mockVillas = [
//       {
//         _id: '1',
//         nama: 'Villa B',
//         lokasi: 'Jakarta',
//         harga: 500000,
//         kategori: ['budget'],
//         status: 'success',
//         pemilik_villa: {},
//         foto_villa: [],
//       },
//     ];

//     Villa.find.mockResolvedValue(mockVillas);
//     Villa.countDocuments.mockResolvedValue(1);

//     const response = await request(app)
//       .get('/villas')
//       .query({ searchQuery: 'Villa B', harga_min: 400000, harga_max: 600000 });

//     expect(response.status).toBe(200);
//     expect(response.body.data).toEqual([
//       expect.objectContaining({
//         nama: 'Villa B',
//         lokasi: 'Jakarta',
//       }),
//     ]);
//   });

//   it('should return a 500 error if an internal error occurs', async () => {
//     Villa.find.mockRejectedValue(new Error('Database error'));

//     const response = await request(app).get('/villas');

//     expect(response.status).toBe(500);
//     expect(response.body.status).toBe('error');
//     expect(response.body.message).toBe('Internal Server Error');
//   });
// });

describe("POST /villa", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
    await Villa.deleteMany({});
    await Owner.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a villa successfully with authentication", async () => {
    // Create owner and login
    const ownerData = {
      nama: "Owner A",
      email: "owner@test.com",
      password: bcrypt.hashSync("password", 10),
      no_telepon: "08123456789",
    };

    const owner = new Owner(ownerData);
    await owner.save();

    const loginRes = await request(app)
      .post("/api/auth/owner/login")
      .send({ email: "owner@test.com", password: "password" });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    const villaData = {
      nama: "Villa Test",
      alamat: "Jl. Test No. 123",
      harga: 1000000,
      kapasitas: 10,
      fasilitas: ["wifi", "kolam renang"],
    };

    const res = await request(app)
      .post("/api/villa")
      .set("Cookie", [`tokenOwner=${token}`])
      .send(villaData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("status", "success");
    // expect(res.body).toHaveProperty("message", "Villa created successfully");
    // expect(res.body.data).toHaveProperty("name", "Luxury Villa");
    // expect(res.body.data).toHaveProperty("location", "Lombok");
    // expect(res.body.data).toHaveProperty("pemilik_villa", ownerId.toString());
  });

  it("should fail to create a villa without authentication", async () => {
    const loginRes = await request(app)
      .post("/api/auth/owner/login")
      .send({ email: "owner@test.com", password: "password" });

    expect(loginRes.status).toBe(200);
    const token = loginRes.body.token;

    const villaData = {
      nama: "Villa Test",
      alamat: "Jl. Test No. 123",
      harga: 1000000,
      kapasitas: 10,
      fasilitas: ["wifi", "kolam renang"],
    };

    const res = await request(app)
      .post("/api/villa")

      .send(villaData);

    expect(res.status).toBe(403);
    expect(res.body.status).toBe("Failed");
  });
});
