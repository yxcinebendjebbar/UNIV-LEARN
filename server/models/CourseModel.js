//! TODO: create a schema for the course model

import pkg from "mongoose";
const { Schema, model, models } = pkg;

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
  photo: {
    type: String,
    required: [true, "Please provide a photo"],
  },
  videos: [
    {
      type: String,
      required: [true, "Please provide a video"],
    },
  ],
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
  studentProgress: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    progress: {
      type: Number,
      default: 0,
      max: 100,
    },
  },
});

const Course = models.Course || model("Course", courseSchema);

export default Course;
