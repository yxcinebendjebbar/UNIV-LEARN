import express from "express";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
// import ffmpeg from "ffmpeg";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";
import fsExtra from 'fs-extra';
import mongoose from "mongoose";

const router = express.Router();
ffmpeg.setFfmpegPath("C:/ffmpeg-6.1.1-full_build/bin/ffmpeg");


const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
  next();
};

const isProfessor = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "teacher") {
    return res
      .status(403)
      .json({ error: "Only professors can perform this action" });
  }
  next();
};

// Define storage for files using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure userId and courseName are provided
    const userId = req.session.user.id;
    if (!userId || !req.body.name) {
      return cb(new Error("User ID and course name are required"));
    }
    const name = req.body.name.trim();
    const uploadPath = path.posix.join(
      "uploads",
      userId,
      name,
      file.originalname.replace(/\.[^/.]+$/, "")
    ); // Use path.posix.join for forward slashes
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath, 0o666);
  },
  filename: function (req, file, cb) {
    // Use the original filename for the file inside the folder
    cb(null, uuidv4() + "-" + file.originalname.trim());
  },
});

const upload = multer({ storage: storage });

// Route for retrieving all courses
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for retrieving a single course by its ID
// router.get("course/:id", isLoggedIn, async (req, res) => {
//   try {
//     const courseId = req.params.id;
//     const userId = req.session.user.id;
//     const userRole = req.session.user.role;

//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({ error: "Course not found" });
//     }

//     // Check if the user is enrolled in the course
//     let isEnrolled = false;
//     if (userRole === "student") {
//       const student = await User.findById(userId);
//       if (!student) {
//         return res.status(404).json({ error: "Student not found" });
//       }
//       isEnrolled = student.enrolledCourses.some(
//         (enrolledCourse) => String(enrolledCourse.courseId) === courseId
//       );
//     } else if (userRole === "teacher") {
//       const professor = await User.findById(userId);
//       if (!professor) {
//         return res.status(404).json({ error: "Professor not found" });
//       }
//       isEnrolled = professor.enrolledCourses.some(
//         (enrolledCourse) => String(enrolledCourse.courseId) === courseId
//       );
//     }

//     // Return different responses based on enrollment status
//     if (isEnrolled) {
//       // Return course data without any restrictions
//       return res.status(200).json(course);
//     } else {
//       // Return a restricted version of the course data
//       const restrictedCourseData = {
//         _id: course._id,
//         name: course.courseName,
//         description: course.description,
//         photo: course.photo,
//         videos: course.videos,
//         rating: course.rating,
//         // Add any other properties you want to include in the restricted version
//       };
//       return res.status(200).json(restrictedCourseData);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    console.log(course);

    res.status(200).json(course);
  } catch (error) {}
});

// Route for deleting a course by its ID
router.delete("/:id", isProfessor, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.session.user.id;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the user ID of the requester matches the user ID of the course creator
    console.log(course.userId.toString(), "\n", userId);
    if (course.userId.toString() !== userId) {
      return res.status(403).json({
        error:
          "Unauthorized access: You are not authorized to delete this course",
      });
    }

    // Delete course files from uploads directory
    await deleteCourseFiles(course, userId);

    // Delete the course from the database
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to delete course files from uploads directory
async function deleteCourseFiles(course, userId) {
  try {
    const uploadsPath = path
      .join("uploads", userId, course.courseName)
      .replace(/\\/g, "/");
    console.log(uploadsPath);
    console.log(fs.existsSync(uploadsPath));
    // Check if directory exists before attempting to delete
    if (fs.existsSync(uploadsPath)) {
      fs.rmSync(uploadsPath, { recursive: true }); // Recursively delete the directory and its contents
      console.log("Course files deleted:", uploadsPath);
    }
  } catch (error) {
    console.error("Error deleting course files:", error);
    throw error; // Propagate the error to the caller
  }
}

// Route for creating a new course
router.post(
  "/post",
  isProfessor,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const userId = req.session.user.id;
      const { name, description, specialty, faculty, department, level } =
        req.body; // Use 'name' field as 'courseName'
      const { photo, videos } = req.files;

      const normalizedPhotoPath = photo[0].path.replace(/\\/g, "/");

      // Ensure at least one video is provided
      if (!videos || videos.length === 0) {
        return res
          .status(400)
          .json({ error: "Please provide at least one video" });
      }

      // Convert videos to m3u8 format before saving paths
      const videoData = await convertVideosToM3u8(
        videos || [],
        userId,
        name.trim()
      ); // Pass userId and name
      console.log(videoData);
      const course = new Course({
        userId,
        courseName: name,
        description,
        specialty,
        faculty,
        department,
        level,
        photo: normalizedPhotoPath,
        videos: videoData.map((data) => ({
          originalVideoPath: data.originalVideoPath,
          folderPath: data.folderPath,
          m3u8MasterPath: data.masterM3u8Path,
        })),
      });

      await course.save();
      res.status(201).json({ message: "Course created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

async function convertVideosToM3u8(videos, userId, name) {
  const convertedPaths = [];
  for (const video of videos) {
    try {
      const originalResolution = await getVideoResolution(video.path);
      const resolutionsToConvert = getResolutionsToConvert(originalResolution);

      // Check if resolutionsToConvert array is empty
      if (resolutionsToConvert.length === 0) {
        throw new Error("Video resolution is too small for conversion");
      }

      const pathsForVideo = [];

      for (const resolution of resolutionsToConvert) {
        const { folderPath, masterM3u8Path } = await convertVideo(
          video.path,
          userId,
          name,
          resolution.width,
          resolution.height
        );
        const originalVideoPath = path.posix.normalize(
          path.posix.join(folderPath, path.basename(video.path))
        );
        pathsForVideo.push({ folderPath, originalVideoPath, masterM3u8Path });
      }

      convertedPaths.push(pathsForVideo[0]);
    } catch (error) {
      console.error("Error converting video:", video.path, error);
      throw error;
    }
  }
  return convertedPaths;
}

async function convertVideo(filePath, userId, name, width, height) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const fileNameWithoutExtension = path.basename(
    normalizedPath,
    path.extname(normalizedPath)
  );
  const uploadDir = path.posix.join(
    "uploads",
    userId,
    name,
    "m3u8Videos",
    fileNameWithoutExtension
  );
  const masterM3u8Path = path.posix.join(
    uploadDir,
    `${fileNameWithoutExtension}.m3u8`
  );

  const variantPlaylistPath = `${fileNameWithoutExtension}_${width}x${height}.m3u8`;

  await convertToResolution(
    normalizedPath,
    uploadDir,
    variantPlaylistPath,
    width,
    height
  );

  await createMasterM3u8(
    masterM3u8Path,
    [variantPlaylistPath],
    [{ width, height }]
  );

  return { folderPath: path.posix.dirname(normalizedPath), masterM3u8Path };
}

async function getVideoResolution(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const stream = metadata.streams.find(
          (stream) => stream.codec_type === "video"
        );
        const resolution = { width: stream.width, height: stream.height };
        resolve(resolution);
      }
    });
  });
}

function getResolutionsToConvert(originalResolution) {
  const resolutions = [
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
    { width: 854, height: 480 },
    { width: 640, height: 360 },
  ];

  return resolutions.filter(
    (resolution) =>
      resolution.width <= originalResolution.width &&
      resolution.height <= originalResolution.height
  );
}

async function convertToResolution(
  inputPath,
  outputDir,
  outputFileName,
  width,
  height
) {
  return new Promise((resolve, reject) => {
    const outputFilePath = path.posix.join(outputDir, outputFileName);

    // Create the directory if it doesn't exist
    fs.mkdirSync(outputDir, { recursive: true });

    ffmpeg(inputPath)
      .outputOptions(`-vf scale=${width}:${height}`)
      .output(outputFilePath)
      .format("hls")
      .addOption("-hls_time", "10") // Set segment duration to 10 seconds
      .addOption("-hls_list_size", "0") // Allow unlimited segments in the playlist
      .on("end", () => {
        console.log(
          `Conversion to ${width}x${height} complete:`,
          outputFilePath
        );
        resolve();
      })
      .on("error", (err) => {
        console.error(`Error during conversion to ${width}x${height}:`, err);
        reject(err);
      })
      .run();
  });
}

async function createMasterM3u8(masterM3u8Path, variantPlaylists, resolutions) {
  return new Promise((resolve, reject) => {
    // Validate that variantPlaylists and resolutions arrays have the same length
    if (variantPlaylists.length !== resolutions.length) {
      reject(
        new Error(
          "variantPlaylists and resolutions arrays must have the same length"
        )
      );
      return;
    }

    const playlistContent = resolutions
      .map((resolution, index) => {
        const playlistPath = variantPlaylists[index];
        const estimatedBitrate = calculateBitrate(
          resolution.width,
          resolution.height
        );

        return `#EXT-X-STREAM-INF:BANDWIDTH=${estimatedBitrate},RESOLUTION=${resolution.width}x${resolution.height},NAME="${resolution.height}"\n${playlistPath}`;
      })
      .join("\n");

    // Check if the master m3u8 file exists
    const isNewFile = !fs.existsSync(masterM3u8Path);

    const content = isNewFile
      ? "#EXTM3U\n#EXT-X-VERSION:3\n" + playlistContent
      : playlistContent;

    // Append the playlist content to the existing master m3u8 file or create a new file if it doesn't exist
    fs.appendFile(masterM3u8Path, content + "\n", (err) => {
      if (err) {
        console.error("Error appending to master m3u8 file:", err);
        reject(err);
      } else {
        if (isNewFile) {
          console.log("New master m3u8 file created:", masterM3u8Path);
        } else {
          console.log(
            "Resolutions appended to master m3u8 file:",
            masterM3u8Path
          );
        }
        resolve();
      }
    });
  });
}

function calculateBitrate(width, height, frameRate = 30, encoding = "h264") {
  // Quality factor (adjust based on desired quality, lower for higher quality)
  const qualityFactor = 0.2;

  // Base bitrate per pixel (adjust based on encoding and complexity)
  const baseBitratePerPixel = {
    h264: 0.5, // Adjust for H.264 (AVC)
    hevc: 0.33, // Adjust for H.265 (HEVC)
  };

  // Validate encoding (default to H.264 if invalid)
  encoding = encoding.toLowerCase() === "hevc" ? "hevc" : "h264";

  // Calculate estimated bitrate based on width, height, frame rate, quality, and encoding
  const estimatedBitrate =
    width * height * frameRate * qualityFactor * baseBitratePerPixel[encoding];

  // Clamp the bitrate to reasonable ranges (adjust as needed)
  return Math.min(
    Math.max(estimatedBitrate, 0.4 * 1024 * 1024),
    8 * 1024 * 1024
  ); // Clamp to range (0.4 - 8 Mbps)
}

// Route for enrolling in a course
router.post("/enroll", isLoggedIn, async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const userId = req.session.user.id;

    const  user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the user is already enrolled in the course
    if (user.enrolledCourses.some(course => course.courseId.toString() === courseId)) {
      return res.status(400).json({ error: "User is already enrolled in this course" });
    }

    course.enrollmentCount += 1;

    user.enrolledCourses.push({ courseId: new mongoose.Types.ObjectId(courseId) }); // Convert courseId to ObjectId
    await Promise.all([user.save(), course.save()]);

    res.status(200).json({ message: "User enrolled in the course successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get enrolled courses
router.get("/enrolled-courses", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const role = req.session.user.role;

    let user;
    if (role === "student") {
      user = await User.findById(userId).populate("enrolledCourses.courseId");
    } else if (role === "teacher") {
      user = await Prof.findById(userId).populate("enrolledCourses.courseId");
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/my-courses", isProfessor, async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.session.user.id }).populate(
      "userId"
    );
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/details/:id", isProfessor, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const courseId = req.params.id;
    const updateData = req.body;
    
    // Filter out fields that shouldn't be updated
    const allowedFields = ["description", "specialty", "faculty", "department", "level", "rating"];
    const filteredUpdateData = {};
    for (const key in updateData) {
      if (allowedFields.includes(key)) {
        filteredUpdateData[key] = updateData[key];
      }
    }

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify if the user is the owner of the course
    if (course.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You are not the owner of this course" });
    }

    // Update the course details
    const updatedCourse = await Course.findByIdAndUpdate(courseId, filteredUpdateData, { new: true, runValidators: true });

    // Respond with the updated course data
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/update/name/:id", isProfessor, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const courseId = req.params.id;
    const { name: newName } = req.body;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify if the user is the owner of the course
    if (course.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You are not the owner of this course" });
    }

    // Rename course directory and contents
    await renameCourseDirectory(course, newName);

    // Update course name in the database
    course.courseName = newName;
    await course.save();

    res.json({ message: "Course name updated successfully" });
  } catch (error) {
    console.error('Error updating course name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
async function renameCourseDirectory(course, newName) {
  try {
    const oldName = course.courseName;
    const uploadPath = path.posix.join("uploads", course.userId.toString());
    const sourcePath = path.posix.join(uploadPath, oldName);
    const destPath = path.posix.join(uploadPath, newName);

    // Check if the source directory exists
    const sourceExists = await fsExtra.pathExists(sourcePath);

    if (!sourceExists) {
      throw new Error('Source directory not found');
    }

    // Check if the destination directory exists
    const destExists = await fsExtra.pathExists(destPath);

    if (destExists) {
      throw new Error('Destination directory already exists');
    }

    // Copy all files and subdirectories to the destination
    await fsExtra.copy(sourcePath, destPath);

    // Update the file paths for videos
    for (const video of course.videos) {
      video.originalVideoPath = video.originalVideoPath.replace(new RegExp(`/${oldName}/`, 'g'), `/${newName}/`);
      video.folderPath = video.folderPath.replace(new RegExp(`/${oldName}/`, 'g'), `/${newName}/`);
      video.m3u8MasterPath = video.m3u8MasterPath.replace(new RegExp(`/${oldName}/`, 'g'), `/${newName}/`);
    }

    // Update the photo path if necessary
    if (course.photo && course.photo.includes(`/${oldName}/`)) {
      course.photo = course.photo.replace(new RegExp(`/${oldName}/`, 'g'), `/${newName}/`);
    }

    // Remove the old directory
    await fsExtra.remove(sourcePath);

    console.log('Course directory renamed successfully');
  } catch (error) {
    console.error('Error renaming course directory:', error);
    throw new Error('Failed to rename course directory');
  }
}

router.put(
  "/update/photoandvideo/:id",
  isProfessor,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const userId = req.session.user.id;
      const courseId = req.params.id;
      const { photo, videos } = req.files;

      // Find the course by ID
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Verify if the user is the owner of the course
      if (course.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized: You are not the owner of this course" });
      }

      // Function to remove directory recursively if empty
      const removeDirIfEmpty = async (dirPath) => {
        const isEmpty = (await fsExtra.readdir(dirPath)).length === 0;
        if (isEmpty) {
          await fsExtra.remove(dirPath);
          console.log(`Directory ${dirPath} removed because it's empty`);
        }
      };

      // Delete old photo if provided
      if (photo && photo.length > 0) {
        // Remove the old photo
        await fsExtra.remove(course.photo);
        await removeDirIfEmpty(path.dirname(course.photo));
        const normalizedPhotoPath = photo[0].path.replace(/\\/g, "/");
        course.photo = normalizedPhotoPath;
      }

      // Delete old videos if provided
      if (videos && videos.length > 0) {
        // Remove the old videos
        await Promise.all(course.videos.map(async (video) => {
          console.log(video.folderPath);
          await fsExtra.remove(video.originalVideoPath);
          await fsExtra.remove(path.dirname(path.dirname(video.m3u8MasterPath)));
          await removeDirIfEmpty(path.dirname(video.originalVideoPath));
        }));
        const videoData = await convertVideosToM3u8(
          videos,
          course.userId.toString(),
          course.courseName.trim()
        ); // Pass userId and courseName
        // Update existing videos or add new ones
        course.videos = videoData.map((data) => ({
          originalVideoPath: data.originalVideoPath,
          folderPath: data.folderPath,
          m3u8MasterPath: data.masterM3u8Path,
        }));
      }

      // Save the updated course
      await course.save();
      res.status(200).json({ message: "Course videos and photo updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// router.get("/search", async (req, res) => {
//   try {
//     const { searchTerm, filters } = req.query;

//     let query = {};
//     const matchConditions = [];

//     if (searchTerm) {
//       matchConditions.push({
//         $or: [
//           { courseName: { $regex: searchTerm, $options: "i" } },
//           { description: { $regex: searchTerm, $options: "i" } },
//         ],
//       });
//     }

//     if (filters) {
//       const filterObject = JSON.parse(filters);

//       const availableFilters = ["department", "faculty", "level"];
//       availableFilters.forEach((filterKey) => {
//         if (filterObject[filterKey]) {
//           const filterValues = Array.isArray(filterObject[filterKey])
//             ? filterObject[filterKey]
//             : [filterObject[filterKey]];
//           matchConditions.push({ [filterKey]: { $in: filterValues } });
//         }
//       });
//     }

//     if (matchConditions.length > 0) {
//       query = { $and: matchConditions };
//     }
//     const courses = await Course.find(query).select("-videos");

//     res.status(200).json(courses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

export default router;
