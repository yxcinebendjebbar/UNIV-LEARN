import express from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/UserModel.js";
import Course from "../models/CourseModel.js";

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
};
const isProfessor = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "teacher") {
    return res
      .status(403)
      .json({ error: "Only professors can perform this action" });
  }
  next();
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
  console.log(req.body);
  try {
    const { fullName, email, passwrd, role } = req.body;

    const newUser = new User({
      fullName,
      email,
      passwrd,
      role,
    });

    const user = await newUser.save();
    req.session.user = {
      username: user.fullName,
      role: user.role,
      id: user._id,
      profilePicture: user.profilePicture,
    };
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session error", err });
      }
      res.status(201).json({
        message: "User created successfully",
        user: req.session.user,
        auth: true,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message, auth: false });
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

    req.session.user = {
      username: user.fullName,
      role: user.role,
      id: user._id,
      profilePicture: user.profilePicture,
    };
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session error", err });
      }
      // res.send("Login successful, session user id: " + req.session.user.id);
      res.status(200).json({
        message: "Login successful",
        user: req.session.user,
        auth: true,
      });
    });

    // res.redirect("/hp");
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

export default router;
