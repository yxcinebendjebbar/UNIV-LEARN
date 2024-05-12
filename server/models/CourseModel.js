import pkg from "mongoose";
import validator from "validator";
const { Schema, model, models } = pkg;

const videoSchema = new Schema({
  originalVideoPath: {
    type: String,
    required: true,
  },
  folderPath: {
    type: String,
    required: true,
  },
  m3u8MasterPath: {
    type: String,
    required: true,
  },
});

// Define the course schema
const courseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  summary: String,
  specialty: String,
  faculty: String,
  department: String,
  level: String,
  photo: String,
  // Embed the video schema within the course schema
  videos: {
    type: [videoSchema],
    validate: [videosArrayValidator, "At least one video is required"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  enrollmentCount: {
    type: Number,
    default: 0,
  },
});

// Custom validator function to ensure at least one video is provided
function videosArrayValidator(videos) {
  return videos.length > 0;
}

// XSS protection
courseSchema.pre("save", function (next) {
  this.courseName = validator.escape(this.courseName.trim());
  this.description = validator.escape(this.description.trim());
  this.specialty = validator.escape(this.specialty.trim());
  this.faculty = validator.escape(this.faculty.trim());
  this.department = validator.escape(this.department.trim());
  this.level = validator.escape(this.level.trim());
  next();
});

// Middleware for findOneAndUpdate
courseSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.courseName) {
    update.courseName = validator.escape(update.courseName.trim());
  }
  if (update.description) {
    update.description = validator.escape(update.description.trim());
  }
  if (update.specialty) {
    update.specialty = validator.escape(update.specialty.trim());
  }
  if (update.faculty) {
    update.faculty = validator.escape(update.faculty.trim());
  }
  if (update.department) {
    update.department = validator.escape(update.department.trim());
  }
  if (update.level) {
    update.level = validator.escape(update.level.trim());
  }
  next();
});

const Course = models.Course || model("Course", courseSchema);

export default Course;
