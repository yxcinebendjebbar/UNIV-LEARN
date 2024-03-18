//! TODO: create a schema for the course review model

import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  writerName: {
    type: Schema.Types.ObjectId,
    ref: "Student" || "Prof",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Review = models.Review || model("Review", reviewSchema);
export default Review;
