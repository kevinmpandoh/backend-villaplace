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

// export const verifyAdminOwner = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const tokenAdmin = req.cookies.tokenAdmin;
//     const tokenOwner = req.cookies.tokenOwner;
//     if (tokenOwner || tokenAdmin) {
//       const token = tokenAdmin || tokenOwner; // Use whichever token is available
//       jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
//         if (err) {
//           if (err.name === "TokenExpiredError") {
//             res.clearCookie("tokenAdmin");
//             return res.status(401).json({
//               status: "Failed",
//               message: "Sessi berakhir, token telah kadaluarsa!",
//             });
//           }
//           return res.status(400).json({
//             status: "Failed",
//             message: "Invalid token",
//           });
//         }
//         req.body.admin = decoded;
//         next();
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

export const verifyAdminOwner = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const tokenAdmin = req.cookies.tokenAdmin;
    const tokenOwner = req.cookies.tokenOwner;

    // Check if either tokenAdmin or tokenOwner is present
    if (tokenAdmin || tokenOwner) {
      const token = tokenAdmin || tokenOwner; // Use whichever token is available

      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            // Clear the expired token cookie
            res.clearCookie(tokenAdmin ? "tokenAdmin" : "tokenOwner");
            return res.status(401).json({
              status: "Failed",
              message: "Session expired, token has expired!",
            });
          }
          return res.status(400).json({
            status: "Failed",
            message: "Invalid token",
          });
        }

        // Attach the decoded data to the request body for later use
        req.body.admin = decoded;

        // Proceed to the next middleware
        next();
      });
    } else {
      res.status(401).json({
        status: "Failed",
        message: "Unauthorized: No token provided",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

// export const verifyAdminOwner = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   try {
//     const tokenAdmin = req.cookies.tokenAdmin;
//     const tokenOwner = req.cookies.tokenOwner;

//     // Debug: Log apakah token ditemukan
//     console.log("Token Admin:", tokenAdmin);
//     console.log("Token Owner:", tokenOwner);

//     // Pastikan salah satu token tersedia
//     if (!tokenAdmin && !tokenOwner) {
//       res.status(401).json({
//         status: "Failed",
//         message: "Unauthorized: No token provided",
//       });
//       return;
//     }

//     const token = tokenAdmin || tokenOwner;

//     jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
//       if (err) {
//         console.error("JWT Verification Error:", err);

//         if (err.name === "TokenExpiredError") {
//           // Clear expired token cookie
//           res.clearCookie(tokenAdmin ? "tokenAdmin" : "tokenOwner");
//           return res.status(401).json({
//             status: "Failed",
//             message: "Session expired, token has expired!",
//           });
//         }

//         return res.status(400).json({
//           status: "Failed",
//           message: "Invalid token",
//         });
//       }

//       // Debug: Log hasil decoded token
//       console.log("Decoded Token:", decoded);

//       // Validasi role (admin atau owner saja yang diizinkan)
//       if (decoded.role !== "admin" && decoded.role !== "owner") {
//         return res.status(403).json({
//           status: "Failed",
//           message: "Forbidden: You do not have access to this resource",
//         });
//       }

//       // Tambahkan data decoded ke req.body.owner
//       req.body.owner = { ownerId: decoded.id, role: decoded.role };

//       next();
//     });
//   } catch (error) {
//     console.error("Middleware Error:", error);

//     res.status(500).json({
//       status: "Failed",
//       message: "Internal Server Error",
//     });
//   }
// };
