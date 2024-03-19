import express from "express";

import Student from "../models/StudentModel.js";

const router = express.Router();

// Student sign up
router.post("/signup", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const student = await newStudent.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student login

router.post("/login", async (req, res) => {
  try {
    const student = await Student.findOne({
      email: req.body.email,
      passwrd: req.body.passwrd,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
