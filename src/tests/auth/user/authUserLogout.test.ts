import request from "supertest";
import app from "../../../app"; // Pastikan ini adalah instance Express

describe("Logout User Controller", () => {
  it("should clear the tokenUser cookie and return success response", async () => {
    const response = await request(app)
      .post("/api/auth/user/logout") // Gunakan route sesuai dengan implementasi Anda
      .set("Cookie", "tokenUser=someRandomToken");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "Success");
    expect(response.body).toHaveProperty("message", "Logout berhasil");
    // Pastikan cookie dihapus
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(response.headers["set-cookie"][0]).toMatch(
      /tokenUser=;/ // Cookie dihapus
    );
  });

  it("should return 500 if an error occurs during logout", async () => {
    // Mock `res.clearCookie` untuk memicu error
    jest.spyOn(app.response, "clearCookie").mockImplementation(() => {
      throw new Error("Clear cookie error");
    });

    const response = await request(app).post("/api/auth/user/logout");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("status", "Failed");
    expect(response.body).toHaveProperty(
      "message",
      "Server error during logout"
    );
    expect(response.body.errors).toHaveProperty(
      "server",
      "Terjadi kesalahan pada server saat logout"
    );

    // Bersihkan mock
    jest.restoreAllMocks();
  });
});
