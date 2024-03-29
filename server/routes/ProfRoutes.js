import express from "express";
import bcrypt from "bcrypt";
import Prof from "../models/ProfModel.js";

const router = express.Router();

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

export default router;
