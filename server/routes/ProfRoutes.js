import express from "express";
import bcrypt from "bcrypt";
import Prof from "../models/ProfModel.js";
import session from "express-session";

const router = express.Router();
router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true, maxAge: 3600000 },
  })
);

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
      return res.status(404).json({ error: "Professor not found" });
    }

    const passwordMatch = await bcrypt.compare(passwrd, prof.passwrd);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    req.session.userId = prof._id;
    res.status(200).json({ message: "Login successful", student });
    // res.redirect("/hp");

    res.status(200).json({ message: "Login successful", prof });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
