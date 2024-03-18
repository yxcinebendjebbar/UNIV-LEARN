//! TODO: create a schema for the teacher model

import { model, models, Schema } from "mongoose";

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

const Prof = models.Prof || model("Prof", profSchema);

export default Prof;
