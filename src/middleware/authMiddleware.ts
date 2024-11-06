// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// // Definisikan tipe pengguna
// interface User {
//   id: string;
//   email: string;
//   role: string;
// }

// // Perluas interface Request untuk menambahkan properti user
// interface AuthRequest extends Request {
//   user?: User;
// }

// export const authMiddleware = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as User; // Menetapkan tipe decoded
//     req.user = decoded; // Menyimpan informasi pengguna yang terautentikasi
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };
