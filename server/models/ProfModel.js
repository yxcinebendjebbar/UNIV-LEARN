import pkg from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model, models } = pkg;

const profSchema = new Schema({
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
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
      },
      message: "Password must contain at least 8 characters, including UPPER/lowercase and numbers",
    },
  },
  status: {
    type: String,
    default: "allowed",
  },
});

// Hash password before saving to the database
profSchema.pre("save", async function (next) {
  const prof = this;
  if (!prof.isModified("passwrd")) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(prof.passwrd, 12);
    prof.passwrd = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const Prof = models.Prof || model("Prof", profSchema);

export default Prof;
