import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import User from "../models/UserModel.js";
import Course from "../models/CourseModel.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const bearer = req.headers.authorization.split(" ");
    token = bearer[1];

    req.token = token;
    next();
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};
const isProfessor = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const bearer = req.headers.authorization.split(" ");
    token = bearer[1];

    req.token = token;
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
    if (decoded.user.role === "professor") {
      next();
    }
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};

// Array of allowed file extensions
const allowedExtensions = [".jpg", ".jpeg", ".png"];
// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.session.user.id;

    if (!userId) {
      return cb(new Error("Login required"));
    }

    const uploadPath = path.posix.join(
      "uploads",
      String(userId),
      "profilepicture"
    ); // Use path.posix.join for forward slashes
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath, 0o666);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    // Check if the file extension is allowed
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Only JPG, JPEG, PNG files are allowed"));
    }

    cb(null, "pic" + ext);
  },
});

const upload = multer({ storage });

// User sign up
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, passwrd, role } = req.body;

    const newUser = new User({
      fullName,
      email,
      passwrd,
      role,
    });

    const user = await newUser.save();
    const token = await jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
        },
      },
      process.env.SECRET_JWT_KEY,
      { expiresIn: "15d" }
    );

    return res.status(200).json({
      token: token,
      user: {
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, passwrd } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(passwrd, user.passwrd);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = await jwt.sign(
      {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
        },
      },
      process.env.SECRET_JWT_KEY,
      { expiresIn: "15d" }
    );

    return res.status(200).json({
      token: token,
      user: {
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get profs names with posted courses

router.get("/profs", async (req, res) => {
  try {
    const result = await Course.aggregate([
      {
        $group: {
          _id: "$userId",
          courses: { $push: "$courseName" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$teacher.fullName",
          profilePicture: "$teacher.profilePicture",
          courses: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile picture
router.put(
  "/profile/profile-picture",
  isLoggedIn,
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const userId = req.session.user.id;
      const profilePicture = path.normalize(req.file.path).replace(/\\/g, "/"); // Assuming Multer has stored the file path in req.file.path

      if (!userId) {
        return res.status(401).json({ error: "User ID not found in session" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "not found" });
      }

      req.session.user.profilePicture = updatedUser.profilePicture;

      res.status(200).json({ user: req.session.user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Route to update user's own password
router.put("/profile/password", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { password, prevPw } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(prevPw, user.passwrd);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Update the user's password
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { passwrd: password },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update user's own name
router.put("/profile/name", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { name } = req.body;

    // Update the user's name
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName: name },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.user.username = updatedUser.fullName;
    // Respond with the updated user data
    res.json({ user: req.session.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update user's own email
router.put("/profile/email", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { email } = req.body;

    // Update the user's email
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.user.email = updatedUser.email;

    // Respond with the updated user data
    res.json({ user: req.session.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete user's own profile
router.delete("/profile", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//forgot password route

router.post("/forgotpass", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "univlearn13@gmail.com",
        pass: process.env.APPPASSWORD,
      },
    });

    const receiver = {
      from: "univlearn13@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Click on the link to reset your password: https://univ-learn.vercel.app/resetpassword/${user?._id}`,
    };
    transporter.sendMail(receiver);
    res.status(200).json({ message: "Email sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

router.put("/resetpass", async (req, res) => {
  const { id, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updated = await User.findByIdAndUpdate(
      id,
      { passwrd: password },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "univlearn13@gmail.com",
        pass: process.env.APPPASSWORD,
      },
    });

    const receiver = {
      from: "univlearn13@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Click on the link to verify your email: http://localhost:5173/emailverification/${user?._id}`,
    };
    if (user?.role === "student") {
      transporter.sendMail(receiver);
      console.log("Email sent successfully");
      res
        .status(200)
        .json({ message: "Email sent successfully", success: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

router.post("/activate-account/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "allowed" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Account activated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

export default router;
