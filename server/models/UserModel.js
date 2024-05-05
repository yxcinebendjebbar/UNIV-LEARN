import pkg from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import mongoose from "mongoose";

const { Schema, model, models } = pkg;

const enrolledCourseSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    validate: {
      validator: function (v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: (props) => `${props.value} is not a valid course ID!`,
    },
  },
});

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Please provide a full name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email already exists"],
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email address",
    },
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
    enum: ["student", "teacher", "admin"],
  },
  status: {
    type: String,
    default: "allowed",
  },
  enrolledCourses: {
    type: [enrolledCourseSchema],
    default: [],
  },
  favoriteCourses: {
    type: [enrolledCourseSchema],
    default: [],
  },
  profilePicture: {
    type: String,
    default: "assets/default-profilepic.jpg",
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

// Pre middleware for findOneAndUpdate
userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const updates = this._update;
    if (updates.fullName) {
      updates.fullName = validator.escape(updates.fullName.trim());
    }
    if (updates.passwrd) {
      const hashedPassword = await bcrypt.hash(updates.passwrd, 12);
      this._update.passwrd = hashedPassword;
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const User = models.User || model("User", userSchema);

export default User;
