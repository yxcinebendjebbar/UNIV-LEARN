//! TODO: create a schema for the forum model

import { Schema, model, models } from "mongoose";

const forumSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

const Forum = models.Forum || model("Forum", forumSchema);
export default Forum;
