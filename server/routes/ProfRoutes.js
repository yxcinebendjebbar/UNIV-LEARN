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

export default router;
