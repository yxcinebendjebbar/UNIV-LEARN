import pkg from "mongoose";
import validator from "validator";

const { Schema, model, models } = pkg;

const adminSchema = new Schema({
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
  password: {
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
});

const Admin = models.Admin || model("Admin", adminSchema);

export default Admin;
