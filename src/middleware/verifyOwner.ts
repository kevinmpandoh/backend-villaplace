import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Perluas interface Request untuk menambahkan properti userId dan role
// interface AuthRequest extends Request {
//   userId?: string;
//   role?: string;
// }

export const verifyOwner = (
  req: Request, // Mengganti Request dengan AuthRequest
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.tokenUser;
    console.log(token);
    // console.log(req.cookies);
    if (!token) {
      return res
        .status(403)
        .json({ message: "Token is required for authentication" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      // Cek apakah role pengguna adalah 'owner'
      if (decoded.role !== "owner") {
        return res.status(403).json({
          message: "Access denied, only owners can perform this action",
        });
      }
      next();
    });
  } catch (error) {
    console.log(error);
  }

  // Simpan informasi pengguna dalam request untuk digunakan di route selanjutnya
  // req.userId = decoded.id; // Asumsikan decoded.id ada di dalam token
  // req.role = decoded.role; // Asumsikan decoded.role ada di dalam token
};
