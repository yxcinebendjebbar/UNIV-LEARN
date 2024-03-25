//! TODO: create a schema for the forum model

import pkg from "mongoose";
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
    ref: "Prof", 
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course", 
  },
});

const Forum = models.Forum || model("Forum", forumSchema);
export default Forum;
