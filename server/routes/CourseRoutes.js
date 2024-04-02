// ! TODO: Create courses routes (get all courses, get one course by id, post a course and delete a course by id)

import express from "express";
import * as dotenv from "dotenv";
import { multerUploads } from "../utils/multer.js";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/CourseModel.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL COURSES

// GET A COURSE BY ID FOR COURSE PAGE

// POST COURSE

router.post("/", multerUploads, async (req, res) => {
  try {
  } catch (error) {}
});

// DELETE COURSE BY ID
