import express from "express";
import bcrypt from "bcrypt";
import User from "../models/UserModel.js";
import Course from "../models/CourseModel.js";

const router = express.Router();

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
    console.log(req.session.user);
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
          _id: "$creator",
          courses: { $push: "$fullName" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "prof",
        },
      },
      {
        $project: {
          _id: 0,
          name: "$user.fullName",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//admin login
router.post("/admin/login", async (req, res) => {
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
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    req.session.user = {
      username: user.fullName,
      role: user.role,
      id: user._id,
    };
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session error", err });
      }
      res.status(200).json({
        message: "Login successful",
        user: req.session.user,
        auth: true,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
