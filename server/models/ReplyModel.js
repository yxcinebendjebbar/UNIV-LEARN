//! TODO: create a schema for the forum reply model

import pkg from "mongoose";
const { Schema, model, models } = pkg;

const replySchema = new Schema({
  forum: {
    type: Schema.Types.ObjectId,
    ref: "Forum",
    required: true,
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: "Student" || "Prof",
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

const Reply = models.Reply || model("Reply", replySchema);
export default Reply;
