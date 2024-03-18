import express from "express";

import Student from "../models/StudentModel.js";

const router = express.Router();

// Student sign up
router.post("/signup", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    console.log(newStudent);
    const student = await newStudent.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
