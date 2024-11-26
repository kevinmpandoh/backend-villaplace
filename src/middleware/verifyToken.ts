import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

//! CURD OWNER
export const verifyOwner = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.tokenOwner;
    if (!token) {
      return res.status(403).json({
        status: "Failed",
        message: "Anda tidak memiliki akses! ",
      });
    }
    // const owner = jwt.verify(token, JWT_SECRET);
    // req.body.owner = owner;
    // next();
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.clearCookie("tokenOwner");
          return res.status(401).json({
            status: "Failed",
            message: "Sessi berakhir, token telah kadaluarsa!",
          });
        }
        return res.status(400).json({
          status: "Failed",
          message: "Invalid token",
        });
      }
      req.body.owner = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

//

//! fitur admin
export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.tokenAdmin;
    if (!token) {
      return res.status(403).json({
        status: "Failed",
        message: "Anda tidak memiliki akses!/ anda belom login!",
      });
    }
    // const admin = jwt.verify(token, JWT_SECRET);
    // req.body.admin = admin;
    // next();
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.clearCookie("tokenAdmin");
          return res.status(401).json({
            status: "Failed",
            message: "Sessi berakhir, token telah kadaluarsa!",
          });
        }
        return res.status(400).json({
          status: "Failed",
          message: "Invalid token",
        });
      }
      req.body.admin = decoded;
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
    const token = req.cookies.tokenUser;
    if (!token) {
      return res.status(403).json({
        status: "Failed",
        message: "Anda belum melakukan login!",
      });
    }
    // const userLogin = jwt.verify(token, JWT_SECRET);
    // req.body.userLogin = userLogin;
    // next();
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.clearCookie("tokenUser");
          return res.status(401).json({
            status: "Failed",
            message: "Sessi berakhir, token telah kadaluarsa!",
          });
        }
        return res.status(400).json({
          status: "Failed",
          message: "Invalid token",
        });
      }
      req.body.userLogin = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error during authentication" });
  }
};
