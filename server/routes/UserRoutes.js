import express from "express";
import bcrypt from "bcrypt";
import User from "../models/UserModel.js";

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
    req.session.user = { username: user.fullName, role: user.role };
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

    req.session.user = { username: user.fullName, role: user.role };
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

// get user info

router.get("/me", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export default router;
