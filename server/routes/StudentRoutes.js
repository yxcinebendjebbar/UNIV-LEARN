import express from "express";
import bcrypt from "bcrypt";
import Student from "../models/StudentModel.js";

const router = express.Router();

// Student sign up
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, passwrd } = req.body;

    const newStudent = new Student({
      fullName,
      email,
      passwrd, 
    });

    const student = await newStudent.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student login
router.post("/login", async (req, res) => {
  try {
    const { email, passwrd } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const passwordMatch = await bcrypt.compare(passwrd, student.passwrd);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
