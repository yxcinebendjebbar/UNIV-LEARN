import pkg from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const { Schema, model, models } = pkg;

const userSchema = new Schema({
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
  role: {
    type: String,
    enum: ["student", "teacher"],
  },
  status: {
    type: String,
    default: "allowed",
  },
});

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("passwrd")) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(user.passwrd, 12);
    user.passwrd = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// XSS protection
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("fullName")) {
    user.fullName = validator.escape(user.fullName.trim());
  }
  next();
});

const User = models.User || model("User", userSchema);

export default User;
