import React, { useState } from "react";
import axios from "axios";
import { Button } from "@nextui-org/react";

axios.defaults.baseURL = "http://localhost:8000";

const VideoInput = ({ index }) => {
  const fileId = `file-${index}`;
  const videoId = `video-${index}`;

  return (
    <div className='grid gap-2'>
      <label
        className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base'
        htmlFor={fileId}
      >
        Video {index + 1}
      </label>
      <input
        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        id={videoId}
        placeholder='Enter the video title'
        required
        type='file'
        accept='video/*'
      />
      <input
        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        id={videoId}
        placeholder='Enter the video title'
        required
      />
    </div>
  );
};

function NewCourseForm() {
  const [videoInputs, setVideoInputs] = useState([0]);

  const addVideoInput = () => {
    setVideoInputs([...videoInputs, videoInputs.length]);
  };

  const deleteLastVideoInput = () => {
    if (videoInputs.length > 0) {
      setVideoInputs(videoInputs.slice(0, -1));
    }
  };

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

  console.log(thumbnailSrc);

  const postCourse = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const title = formData.get("title");
    const description = formData.get("description");
    const thumbnail = formData.get("thumbnail");
    const videos = formData.getAll("videos");
    const videoTitles = formData.getAll("videoTitles");
    const courseData = {
      title,
      description,
      thumbnail,
      videos: videos.map((video, index) => ({
        title: videoTitles[index],
        video,
      })),
    };
    try {
      const response = await axios.post("/api/courses/post", courseData, {
        withCredentials: true,
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Failed to create course! ");
    }
  };

  return (
    <form
      className='bg-gray-100/40 min-h-screen'
      onSubmit={() => {
        postCourse();
      }}
    >
      <div
        className='rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-3xl bg-white min-h-screen'
        data-v0-t='card'
      >
        <div className='flex flex-col p-6 space-y-0'>
          <h3 className='whitespace-nowrap text-4xl font-semibold leading-none tracking-tight'>
            Add New Course
          </h3>
          <p className='text-lg text-muted-foreground'>
            Fill in the course details
          </p>
        </div>
        <div className='p-6 space-y-6'>
          <div className='space-y-6'>
            <div className='grid gap-2'>
              <label
                className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'
                htmlFor='title'
              >
                Title
              </label>
              <input
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                id='title'
                placeholder='Enter the course title'
                required
              />
            </div>
            <div className='grid gap-2'>
              <label
                className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'
                htmlFor='description'
              >
                Description
              </label>
              <textarea
                className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                id='description'
                placeholder='Enter the course description'
                required
              ></textarea>
            </div>
            <div className='grid gap-2'>
              <label className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'>
                Thumbnail
              </label>
              <div className='flex items-center gap-4'>
                <img
                  src={thumbnailSrc || "https://via.placeholder.com/150x150"}
                  width='150'
                  height='100'
                  alt='Thumbnail'
                  className='aspect-[3/2] rounded-lg overflow-hidden object-cover'
                />
                <input
                  className='flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  id='file'
                  type='file'
                  accept='image/*'
                  onChange={handleThumbnailChange}
                />
              </div>
            </div>
          </div>
          <div className='space-y-6'>
            <div className='grid gap-2'>
              <label className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'>
                Videos
              </label>
              <div className='grid gap-4'>
                {videoInputs.map((index) => (
                  <VideoInput key={index} index={index} />
                ))}
                <Button
                  onClick={() => {
                    addVideoInput();
                  }}
                >
                  Add a video
                </Button>
                <Button
                  onClick={() => {
                    deleteLastVideoInput();
                  }}
                >
                  Delete video
                </Button>
              </div>
            </div>
            <div className='flex justify-end items-center gap-4'>
              <Button
                type='submit'
                className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default NewCourseForm;
