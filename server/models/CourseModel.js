//! TODO: create a schema for the course model

import { model, models, Schema } from "mongoose";

const courseSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Prof",
  },
  name: {
    type: String,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  specialty: {
    type: String,
    required: [true, "Please provide a specialty"],
  },
  faculty: {
    type: String,
    required: [true, "Please provide a faculty"],
  },
  department: {
    type: String,
    required: [true, "Please provide a department"],
  },
  level: {
    type: String,
    required: [true, "Please provide a level"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  nbEnrolled: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    default: 0,
    max: 100,
  },
});

const Course = models.Course || model("Course", courseSchema);

export default Course;
