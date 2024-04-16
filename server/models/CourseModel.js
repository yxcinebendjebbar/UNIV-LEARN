//! TODO: create a schema for the course model

import pkg from "mongoose";
import validator from "validator";
const { Schema, model, models } = pkg;

const courseSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
      title: {
        type: String,
        required: [true, "Please provide a video"],
      },
      url: {
        type: String,
        required: [true, "Please provide a video"],
      },
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

// XSS protection
courseSchema.pre("save", function (next) {
  this.name = validator.escape(this.name);
  this.description = validator.escape(this.description);
  this.specialty = validator.escape(this.specialty);
  this.faculty = validator.escape(this.faculty);
  this.department = validator.escape(this.department);
  this.level = validator.escape(this.level);
  next();
});

const Course = models.Course || model("Course", courseSchema);

export default Course;
