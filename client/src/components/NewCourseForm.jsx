import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "@nextui-org/react";

axios.defaults.baseURL = "https://univ-learn.onrender.com";
function NewCourseForm() {
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);

  const [thumbnailSrc, setThumbnailSrc] = useState("");

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a new FileReader object
      reader.onload = () => {
        // Set the thumbnailSrc state with the data URL of the selected file
        setThumbnailSrc(reader.result);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const postCourse = async (courseData) => {
    try {
      setIsUploading(true);
      const response = await axios.post("/api/courses/post", courseData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      setIsUploading(false);
      console.error(error);
      alert("Failed to create course! ");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitCourse = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    postCourse(formData);
  };

  return (
    <form
      className="form-bg flex justify-center py-3 min-h-screen"
      onSubmit={handleSubmitCourse}
    >
      {isUploading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/35 flex items-center justify-center">
          <Spinner color="primary" />
        </div>
      )}
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-3xl bg-white min-h-screen"
        data-v0-t="card"
      >
        <div className="flex flex-col p-6 space-y-0">
          <h3 className="whitespace-nowrap text-4xl font-semibold leading-none tracking-tight">
            Add New Course
          </h3>
          <p className="text-lg text-muted-foreground">
            Fill in the course details
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-6">
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                name="name"
                id="title"
                placeholder="Enter the course title"
                required
              />
            </div>
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="description"
                name="description"
                placeholder="Enter the course description"
                required
              ></textarea>
            </div>
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="summary"
              >
                Summary
              </label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="summary"
                name="summary"
                placeholder="Enter the course summary"
                required
              ></textarea>
            </div>
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="faculty"
              >
                Faculty
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="faculty"
                name="faculty"
                placeholder="Enter the course faculty"
                required
              />
            </div>
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="department"
              >
                Department
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="department"
                name="department"
                placeholder="Enter the course department"
                required
              />
            </div>
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="specialty"
              >
                Specialty
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="specialty"
                name="specialty"
                placeholder="Enter the course specialty"
                required
              />
            </div>
            <div className="grid gap-2">
              <label
                className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                htmlFor="level"
              >
                Level
              </label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="level"
                name="level"
                placeholder="Enter the course level"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg">
                Thumbnail
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={thumbnailSrc || "https://via.placeholder.com/150x150"}
                  width="150"
                  height="100"
                  alt="Thumbnail"
                  className="aspect-[3/2] rounded-lg overflow-hidden object-cover"
                />
                <input
                  className="flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="thumbnail"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid gap-2">
              <div className="grid gap-2">
                <label
                  className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base"
                  htmlFor="videos"
                >
                  Video
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="videos"
                  name="videos"
                  placeholder="Enter the video title"
                  required
                  type="file"
                  accept="video/*"
                />
              </div>
            </div>
            <div className="flex justify-end items-center gap-4">
              <Button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default NewCourseForm;
