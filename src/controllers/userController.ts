import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { Ulasan } from "../models/Ulasan";
import { Pesanan } from "../models/pesananModel";

//! Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find({}, "-password"); // Exclude password field
    res.json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Get a user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id, "-password"); // Exclude password field

    if (!user) {
      res.status(404).json({
        status: "Failed",
        message: "User not found",
      });
      return;
    }
    res.json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//! Update a user by ID
// export const updateUserById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const { nama, email, no_telepon } = req.body;
//     let updateData: any = { nama, email, no_telepon };

//     //! Cek apakah email, no_telepon, atau nama sudah digunakan oleh user lain
//     const existingUserWithEmail =
//       email && (await User.findOne({ email, _id: { $ne: id } }));
//     const existingUserWithPhone =
//       no_telepon && (await User.findOne({ no_telepon, _id: { $ne: id } }));

//     if (existingUserWithEmail) {
//       res.status(400).json({
//         status: "Failed",
//         error: {
//           message: "Email sudah digunakan oleh user lain",
//           field: "email",
//         },
//       });
//     } else if (existingUserWithPhone) {
//       res.status(400).json({
//         status: "Failed",
//         message: "No telepon sudah digunakan oleh user lain",
//       });
//     } else {
//       const updatedUser = await User.findByIdAndUpdate(id, updateData, {
//         new: true,
//       });
//       if (!updatedUser) {
//         res.status(404).json({
//           status: "Failed",
//           message: "User tidak ada",
//         });
//         return;
//       }
//       res.json({
//         status: "Success",
//         data: updatedUser,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

//? OBJECT ERROR
export const updateUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { nama, email, no_telepon } = req.body;
    let updateData: any = { nama, email, no_telepon };

    //! Cek apakah email, no_telepon, atau nama sudah digunakan oleh user lain
    const existingUserWithEmail =
      email && (await User.findOne({ email, _id: { $ne: id } }));
    const existingUserWithPhone =
      no_telepon && (await User.findOne({ no_telepon, _id: { $ne: id } }));

    if (existingUserWithEmail) {
      // No return here, just send the response
      res.status(400).json({
        status: "Failed",
        error: {
          message: "Email sudah digunakan oleh user lain",
          field: "email",
        },
      });
      return; // Ensures the function stops here
    } else if (existingUserWithPhone) {
      res.status(400).json({
        status: "Failed",
        error: {
          message: "No telepon sudah digunakan oleh user lain",
          field: "no_telepon",
        },
      });
      return;
    } else {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedUser) {
        res.status(404).json({
          status: "Failed",
          error: {
            message: "User tidak ditemukan",
            field: "id",
          },
        });
        return;
      }
      res.json({
        status: "Success",
        data: updatedUser,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error during update",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
};

//! Delete a user by ID
// export const deleteUserById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const deletedUser = await User.findByIdAndDelete(id);
//     if (!deletedUser) {
//       res.status(404).json({ status: "Failed", message: "User not found" });
//       return;
//     }

//     //! Delete all reviews and orders related to the user
//     await Ulasan.deleteMany({ user: id });
//     await Pesanan.deleteMany({ user: id });

//     res.json({
//       status: "Success",
//       message: "User successfully deleted",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

//? OBJECT ERROR
export const deleteUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      // Send error message using an object for easier frontend handling
      res.status(404).json({
        status: "Failed",
        error: {
          message: "User not found",
          field: "id",
        },
      });
      return;
    }

    //! Delete all reviews and orders related to the user
    await Ulasan.deleteMany({ user: id });
    await Pesanan.deleteMany({ user: id });

    res.json({
      status: "Success",
      message: "User successfully deleted",
    });
  } catch (error) {
    // Simplified error message in the catch block
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error during deletion",
      },
    });
  }
};

//! USER CURRENT
// export const getUserCurrent = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userId = req.body.userLogin.userId;
//     const user = await User.findById(userId, "-password"); // Exclude password field
//     if (!user) {
//       res.status(404).json({ status: "Failed", message: "User not found" });
//       return;
//     }
//     res.json({
//       status: "Success",
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

//? OBJECT ERROR
export const getUserCurrent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.body.userLogin.userId;
    const user = await User.findById(userId, "-password"); // Exclude password field

    if (!user) {
      // Return error as an object for easier frontend handling
      res.status(404).json({
        status: "Failed",
        error: {
          message: "User not found",
          field: "userId",
        },
      });
      return;
    }

    res.json({
      status: "Success",
      data: user,
    });
  } catch (error) {
    // Simplified error response
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error while fetching user",
      },
    });
  }
};

//! CHANGE PASSWORD
// export const changePasswordUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     // Validasi panjang password
//     if (newPassword.length < 8) {
//       res.status(400).json({
//         status: "Failed",
//         message: "Password harus memiliki minimal 8 karakter",
//       });
//       return;
//     }
//     const userId = req.body.userLogin.userId; // Ambil userId dari userLogin di req.body
//     const user = await User.findById(userId);

//     if (!user) {
//       res.status(404).json({ status: "Failed", message: "User not found" });
//       return;
//     }

//     // Compare the current password
//     const isMatch = await bcrypt.compare(currentPassword, user.password);

//     if (!isMatch) {
//       res
//         .status(400)
//         .json({ status: "Failed", message: "Incorrect current password" });
//       return;
//     }

//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedNewPassword;
//     await user.save();

//     res.status(200).json({
//       status: "Success",
//       message: "Password successfully updated",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
//? OBJECT ERROR
export const changePasswordUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validasi panjang password
    if (newPassword.length < 8) {
      res.status(400).json({
        status: "Failed",
        error: {
          message: "Password harus memiliki minimal 8 karakter",
          field: "newPassword",
        },
      });
      return;
    }

    const userId = req.body.userLogin.userId; // Ambil userId dari userLogin di req.body
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        status: "Failed",
        error: {
          message: "User not found",
          field: "userId",
        },
      });
      return;
    }

    // Compare the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({
        status: "Failed",
        error: {
          message: "Password yang anda masukan salah",
          field: "currentPassword",
        },
      });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      status: "Success",
      data: {
        message: "Password successfully updated",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error while changing password",
      },
    });
  }
};

// ?

//! UPLOAD IMAGE PROFILE
// export const uploadProfileImagesUser = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.id;
//     const foto_profile = req.file?.filename;
//     let updateData: any = { foto_profile };
//     const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
//       new: true,
//     });

//     res.json({
//       status: "Success",
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to upload user images",
//     });
//   }
// };

//? OBJECT ERROR
export const uploadProfileImagesUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const foto_profile = req.file?.filename;

    if (!foto_profile) {
      res.status(400).json({
        status: "Failed",
        error: {
          message: "Upload foto profile anda!",
          field: "foto_profile",
        },
      });
      return;
    }

    let updateData: any = { foto_profile };
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({
        status: "Failed",
        error: {
          message: "User not found",
          field: "userId",
        },
      });
      return;
    }

    res.status(200).json({
      status: "Success",
      data: {
        message: "Profile image uploaded successfully",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failed",
      error: {
        message: "Server error while uploading the profile image",
      },
    });
  }
};
