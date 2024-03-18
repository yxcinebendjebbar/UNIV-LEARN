//! TODO: create a schema for the forum model

import pkg from "mongoose";
const { Schema, model, models } = pkg;

const forumSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

const Forum = models.Forum || model("Forum", forumSchema);
export default Forum;
