import express from "express";
import Prof from "../models/ProfModel.js";

const router = express.Router();

// Prof sign up
router.post("/signup", async (req, res) => {
  try {
    const newProf = new Prof(req.body);
    console.log(newProf);
    const prof = await newProf.save(); 
    res.status(201).json(prof); 
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

    if (prof.passwrd !== passwrd) {

      return res.status(401).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", prof });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
