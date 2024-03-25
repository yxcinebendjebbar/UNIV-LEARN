//! TODO: create a schema for the course review model

import pkg from "mongoose";
import validator from "validator";
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

// XSS protection
reviewSchema.pre('save', function(next) {
  this.content = validator.escape(this.content.trim());
  next();
});

const Review = models.Review || model("Review", reviewSchema);
export default Review;
