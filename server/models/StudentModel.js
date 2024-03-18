//! TODO: create a schema for the student model

import pkg from "mongoose";
const { Schema, model, models } = pkg;

const studentSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Please provide a full name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email already exists"],
  },
  passwrd: {
    type: String,
    required: [true, "Please provide a password"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must contain at least 8 characters, including UPPER/lowercase and numbers",
    ],
  },
  status: {
    type: String,
    default: "allowed",
  },
});

const Student = models.Student || model("Student", studentSchema);

export default Student;
