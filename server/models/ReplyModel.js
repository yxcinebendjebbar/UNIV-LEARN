//! TODO: create a schema for the forum reply model

import pkg from "mongoose";
import validator from "validator";
const { Schema, model, models } = pkg;

const replySchema = new Schema({
  forum: {
    type: Schema.Types.ObjectId,
    ref: "Forum",
    required: true,
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// XSS protection
replySchema.pre("save", function (next) {
  this.content = validator.escape(this.content.trim());
  next();
});

const Reply = models.Reply || model("Reply", replySchema);
export default Reply;
