import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import Student from "../models/StudentModel.js";

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
};

// Array of allowed file extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png'];
// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.session.user.id;

    if (!userId) {
      return cb(new Error('Login required'));
    }

    const uploadPath = path.posix.join('uploads', String(userId), 'profilepicture'); // Use path.posix.join for forward slashes
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

      // Check if the file extension is allowed
      if (!allowedExtensions.includes(ext)) {
        return cb(new Error('Only JPG, JPEG, PNG files are allowed'));
      }

    cb(null, "pic"+ ext );
  },
});

const upload = multer({ storage });

// Student sign up
router.post("/signup", async (req, res) => {
  console.log(req.body);
  try {
    const { fullName, email, passwrd } = req.body;

    const newStudent = new Student({
      fullName,
      email,
      passwrd,
    });

    const student = await newStudent.save();
    res.status(201).json({
      message: "Student created successfully",
      auth: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, auth: false });
  }
});

// Student login
router.post("/login", async (req, res) => {
  try {
    const { email, passwrd } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const passwordMatch = await bcrypt.compare(passwrd, student.passwrd);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    req.session.user = { id: student._id, role: "student" };
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session error", err });
      }
      // res.send("Login successful, session user id: " + req.session.user.id);
      res
        .status(200)
        .json({
          message: "Login successful",
          studentfullName: student.fullName,
          auth: true,
        });
    });
    console.log(req.session.user);
    // res.redirect("/hp");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student profile picture
router.put("/profile-picture",isLoggedIn, upload.single("profilePicture"), async (req, res) => {
  try {
    const userId = req.session.user.id;
    const profilePicture = path.normalize(req.file.path).replace(/\\/g, '/');; // Assuming Multer has stored the file path in req.file.path

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in session" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
