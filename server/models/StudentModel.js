import pkg from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

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
    validate: {
      validator: function (password) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
          password
        );
      },
      message:
        "Password must contain at least 8 characters, including UPPER/lowercase and numbers",
    },
  },
  status: {
    type: String,
    default: "allowed",
  },
});

// Hash password before saving to the database
studentSchema.pre("save", async function (next) {
  const student = this;
  if (!student.isModified("passwrd")) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(student.passwrd, 12);
    student.passwrd = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// XSS protection
studentSchema.pre("save", function (next) {
  const student = this;
  if (student.isModified("fullName")) {
    student.fullName = validator.escape(student.fullName.trim());
  }
  next();
});

const Student = models.Student || model("Student", studentSchema);

export default Student;
