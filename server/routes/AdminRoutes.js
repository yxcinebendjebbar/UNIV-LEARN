import express from "express";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";
import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import fsExtra from "fs-extra";
const {
  Types: { ObjectId },
} = mongoose;

const router = express.Router();
ffmpeg.setFfmpegPath("C:/ffmpeg-6.1.1-full_build/bin/ffmpeg");

// Array of allowed file extensions
const allowedExtensions = [".jpg", ".jpeg", ".png"];

// Multer disk storage configuration
const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.params.userId; // Access userId from URL parameters
    if (!userId) {
      return cb(new Error("Missing userId"));
    }
    const uploadPath = path.posix.join(
      "uploads",
      String(userId),
      "profilepicture"
    ); // Use path.posix.join for forward slashes
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath, 0o666);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Only JPG, JPEG, PNG files are allowed"));
    }
    cb(null, "profile" + ext); // Set filename as 'profile' with original extension
  },
});

// Multer upload configuration
const upload1 = multer({ storage: storage1 });

// Define storage for files using Multer
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure userId and courseName are provided
    if (!req.body.userId || !req.body.name) {
      return cb(new Error("User ID and course name are required"));
    }
    const name = req.body.name.trim();
    const userId = req.body.userId.trim();
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

const upload2 = multer({ storage: storage2 });

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "log in" });
    }
    // Assuming userId is available in the session or request
    const userId = req.session.user.id; // Adjust this based on your actual session implementation

    // Check if the user is an admin

    const admin = await Admin.findById(userId);

    if (!admin) {
      // If the user is not an admin, return an error response
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route for deleting a course by its ID (for admin)
router.delete("/courses/:id", isAdmin, async (req, res) => {
  try {
    const courseId = req.params.id;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Delete course files from uploads directory
    await deleteCourseFiles(course);

    // Delete the course from the database
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to delete course files from uploads directory
async function deleteCourseFiles(course) {
  try {
    // You can modify this function according to your file structure
    // For example, if each course has its own folder, you can delete that folder
    const uploadsPath = path
      .join("uploads", course.userId.toString(), course.courseName)
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

// Route to update an existing user (admin only)
router.put("/users/:id", isAdmin, async (req, res) => {
  try {
    // Find the user by ID
    const userId = req.params.id;
    const updateData = req.body;

    // Update the user document using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.status(204).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete a user (admin only)
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin route to update any user's profile picture
router.put(
  "/users/profile-picture/:userId",
  isAdmin,
  upload1.single("profilePicture"),
  async (req, res) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Get the file path from req.file
      const filePath = path.posix.normalize(req.file.path).replace(/\\/g, "/"); // Normalize the file path with forward slashes

      // Update the user's profile picture path in the database
      user.profilePicture = filePath;
      await user.save();

      res.status(200).json({
        message: "Profile picture updated successfully",
        filePath: filePath,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Route for creating a new course
router.post(
  "/post",
  isAdmin,
  upload2.fields([
    { name: "photo", maxCount: 1 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const {
        userId,
        name,
        description,
        specialty,
        faculty,
        department,
        level,
      } = req.body; // Use 'name' field as 'courseName'
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
        userId: new ObjectId(userId),
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

router.put("/courses/details/:id", isAdmin, async (req, res) => {
  try {
    const courseId = req.params.id;
    const updateData = req.body;

    // Filter out fields that shouldn't be updated
    const allowedFields = [
      "description",
      "specialty",
      "faculty",
      "department",
      "level",
      "rating",
    ];
    const filteredUpdateData = {};
    for (const key in updateData) {
      if (allowedFields.includes(key)) {
        filteredUpdateData[key] = updateData[key];
      }
    }

    // Find the course by ID and update its details
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      filteredUpdateData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Respond with the updated course data
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update course name
router.put("/courses/name/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name: newName } = req.body;
  try {
    // Find the course by ID
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Rename course directory and contents
    await renameCourseDirectory(course, newName);

    // Update course name in the database
    course.courseName = newName;
    await course.save();

    res.json({ message: "Course name updated successfully" });
  } catch (error) {
    console.error("Error updating course name:", error);
    res.status(500).json({ error: "Internal server error" });
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
      throw new Error("Source directory not found");
    }

    // Check if the destination directory exists
    const destExists = await fsExtra.pathExists(destPath);

    if (destExists) {
      throw new Error("Destination directory already exists");
    }

    // Copy all files and subdirectories to the destination
    await fsExtra.copy(sourcePath, destPath);

    // Update the file paths for videos
    for (const video of course.videos) {
      video.originalVideoPath = video.originalVideoPath.replace(
        new RegExp(`/${oldName}/`, "g"),
        `/${newName}/`
      );
      video.folderPath = video.folderPath.replace(
        new RegExp(`/${oldName}/`, "g"),
        `/${newName}/`
      );
      video.m3u8MasterPath = video.m3u8MasterPath.replace(
        new RegExp(`/${oldName}/`, "g"),
        `/${newName}/`
      );
    }

    // Update the photo path if necessary
    if (course.photo && course.photo.includes(`/${oldName}/`)) {
      course.photo = course.photo.replace(
        new RegExp(`/${oldName}/`, "g"),
        `/${newName}/`
      );
    }

    // Remove the old directory
    await fsExtra.remove(sourcePath);

    console.log("Course directory renamed successfully");
  } catch (error) {
    console.error("Error renaming course directory:", error);
    throw new Error("Failed to rename course directory");
  }
}

router.put(
  "/courses/photoandvideo",
  isAdmin,
  upload2.fields([
    { name: "photo", maxCount: 1 },
    { name: "videos", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { courseId } = req.body; // courseId for identifying the course to update
      const { photo, videos } = req.files;

      // Find the course by ID
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
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
        await Promise.all(
          course.videos.map(async (video) => {
            console.log(video.folderPath);
            await fsExtra.remove(video.originalVideoPath);
            await fsExtra.remove(
              path.dirname(path.dirname(video.m3u8MasterPath))
            );
            await removeDirIfEmpty(path.dirname(video.originalVideoPath));
          })
        );
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
      res
        .status(200)
        .json({ message: "Course videos and photo updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

//admin login
router.post("/login", async (req, res) => {
  try {
    const { email, passwrd } = req.body;

    const admin = await Admin.findOne({ email, password: passwrd });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    req.session.user = {
      username: admin.fullName,
      id: admin._id,
      role: "admin",
    };
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Session error", err });
      }
      res.status(200).json({
        message: "Login successful",
        user: req.session.user,
        auth: true,
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//getting all users
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//getting all courses
router.get("/courses", isAdmin, async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
