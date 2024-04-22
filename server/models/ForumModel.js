//! TODO: create a schema for the forum model

import pkg from "mongoose";
import validator from "validator";
const { Schema, model, models } = pkg;

const forumSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});

// XSS protection
forumSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.title = validator.escape(this.title.trim());
  }

  if (this.isModified("description")) {
    this.description = validator.escape(this.description.trim());
  }

  next();
});

const Forum = models.Forum || model("Forum", forumSchema);
export default Forum;
