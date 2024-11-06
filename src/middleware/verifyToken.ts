import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

//! CURD OWNER
export const verifyOwner = (
  req: Request, // Mengganti Request dengan AuthRequest
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.tokenOwner;
    console.log(token);
    // console.log(req.cookies);
    if (!token) {
      return res.status(403).json({
        status: "Failed",
        message: "Anda tidak memiliki akses! ",
      });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      next();
    });
  } catch (error) {
    console.log(error);
  }
};

//

//! fitur admin
export const verifyAdmin = (
  req: Request, // Mengganti Request dengan AuthRequest
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.tokenAdmin;
    console.log(token);
    // console.log(req.cookies);
    if (!token) {
      return res.status(403).json({
        status: "Failed",
        message: "Anda tidak memiliki akses!/ anda belom login!",
      });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

//! LOGIN USER

export const verifyUserLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.tokenUser; // Ensure you have a token named 'tokenUser' in your cookies
    console.log(token);
    if (!token) {
      return res.status(403).json({
        status: "Failed",
        message: "Anda belum melakukan login!",
      });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during authentication" });
  }
};

export const verifyOwnerLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.tokenOwner; // Ensure you have a token named 'tokenUser' in your cookies
    console.log(token);
    if (!token) {
      return res.status(403).json({
        status: "Failed",
        message: "Anda belum melakukan login!",
      });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during authentication" });
  }
};
