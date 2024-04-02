import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import Prof from "../models/ProfModel.js";
import Course from "../models/CourseModel.js";

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
};
const isProfessor = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "prof") {
    return res.status(403).json({ error: "Only professors can perform this action" });
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

// Prof sign up
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, passwrd } = req.body;

    const newProf = new Prof({
      fullName,
      email,
      passwrd,
    });

    const savedProf = await newProf.save();
    res.status(201).json(savedProf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Prof login
router.post("/login", async (req, res) => {
  try {
    const { email, passwrd } = req.body;

    const prof = await Prof.findOne({ email });

    if (!prof) {
      return res.status(404).json({ error: "Prof not found" });
    }

    const passwordMatch = await bcrypt.compare(passwrd, prof.passwrd);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    req.session.user = { email: prof.email, id: prof._id, role: "prof" };
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session error", err });
      }
      // res.send("Login successful, session user id: " + req.session.user.id);
      res.status(200).json({ message: "Login successful", prof });
    });
    // res.redirect("/hp");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Prof profile picture
router.put("/profile-picture",isLoggedIn, upload.single("profilePicture"), async (req, res) => {
  try {
    const userId = req.session.user.id;
    const profilePicture = path.normalize(req.file.path).replace(/\\/g, '/');; // Assuming Multer has stored the file path in req.file.path

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in session" });
    }

    const updatedProf = await Prof.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );

    if (!updatedProf) {
      return res.status(404).json({ error: "Prof not found" });
    }

    res.status(200).json(updatedProf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get posted courses
router.get("/posted-courses", isProfessor, async (req, res) => {
  try {
    const profId = req.session.user.id;

    // Find courses where the professor ID matches the user's ID
    const courses = await Course.find({ userId: profId });

    if (!courses) {
      return res.status(404).json({ error: "No courses found for this professor" });
    }

    res.status(200).json({ postedCourses: courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
