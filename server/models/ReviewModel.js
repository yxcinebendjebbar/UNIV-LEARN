//! TODO: create a schema for the course review model

import pkg from "mongoose";
const { Schema, model, models } = pkg;

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
