import { React, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactHlsPlayer from "react-hls-player";
import { Spinner } from "@nextui-org/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FaStar } from "react-icons/fa";
import { CardIntro, CardIntroHeader } from "../components/CardIntro";
import { Courseinfo } from "../components/Courseinfo";
import DescriptionComp from "../components/DescriptionComp";

axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.withCredentials = true;

const fakecourseintroData = [
  {
    _id: 1,
    name: "Course intro",
    description:
      "WHAT IS A COURSE DESCRIPTION? A course description serves to state the rationale for the course and give an overview of key content covered, skills and knowledge to be learned, and how it will benefit the student.",
    photo: "https://via.placeholder.com/150",
  },
];
const fakeCourseData = [
  {
    _idc: 2,
    profname: "yasmine anal",
    duration: "1h 40min",
    Enroled: "189",
    profphoto: "https://via.placeholder.com/150",
  },
];

// const VideoJS = (props) => {
//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const { options, onReady } = props;

//   useEffect(() => {
//     if (!playerRef.current) {
//       const videoElement = document.createElement("video");
//       videoElement.className = "video-js";
//       videoRef.current.appendChild(videoElement);

//       const player = (playerRef.current = videojs(videoElement, options, () => {
//         console.log("player is ready");
//         onReady && onReady(player);
//       }));

//       player.src(options.sources);
//       player.on("resolutionchange", () => {
//         console.log("Source changed to", player.src());
//       });
//     } else {
//       const player = playerRef.current;
//       player.src(options.sources);
//     }
//   }, [options, videoRef]);

//   useEffect(() => {
//     if (!playerRef.current) {
//       const videoElement = document.createElement("video");
//       videoElement.className = "video-js";
//       videoRef.current.appendChild(videoElement);

//       const player = (playerRef.current = videojs(videoElement, options, () => {
//         console.log("player is ready");
//         onReady && onReady(player);
//       }));

//       player.on("resolutionchange", () => {
//         console.log("Source changed to", player.src());
//       });

//       console.log("Setting sources:", options.sources);
//       player.src(options.sources);
//     } else {
//       const player = playerRef.current;
//       console.log("Resetting sources:", options.sources);
//       player.src(options.sources);

//       player.load();
//     }
//   }, [options, videoRef]);

//   return <div data-vjs-player ref={videoRef} />;
// };

function CoursePage() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const handleVideoClick = (index) => {
    setActiveVideoIndex(index);
  };

  useEffect(() => {
    axios
      .get(`/api/courses/${id}`)
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  let video = course?.videos[0];

  let videoSrc = `http://localhost:8000/${video?.m3u8MasterPath.slice(8)}`;

  // const videoJsOptions = {
  //   autoplay: false,
  //   controls: true,
  //   responsive: true,
  //   fluid: true,
  //   sources: course?.videos.map((video) => {
  //     let videoSrc = `http://localhost:8000/${video?.m3u8MasterPath.slice(8)}`;
  //     return {
  //       src: videoSrc,
  //       type: "application/x-mpegURL",
  //     };
  //   }),
  //   plugin: {
  //     videojsResolutionSwitcher: {
  //       default: "low",
  //       dynamicLabel: true,
  //     },
  //   },
  // };

  // const handlePlayerReady = (player) => {
  //   playerRef.current = player;

  //   player.on("waiting", () => {
  //     videojs.log("player is waiting");
  //   });

  //   player.on("dispose", () => {
  //     videojs.log("player will dispose");
  //   });
  // };

  const navigate = useNavigate();

  let courseSrc = course?.photo.slice(8);

  return (
    <div className='Course page'>
      <NavBar />
      {!course ? (
        <div className='h-full w-full bg-black/35'>
          <Spinner />
        </div>
      ) : (
        <main className='mx-300 md:px-24 mt-32 pb-8 items-center'>
          <div className='flex flex-wrap gap-8 justify-center items-center'>
            <div>
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  width: "100%",
                }}
              >
                <CardIntro
                  key={course?._id}
                  classNames='bg-white cursor-pointer dark:bg-neutral-800 w-full border dark:border-neutral-600 shadow-lg dark:shadow-white/5'
                >
                  <div className='flex'>
                    <div className='w-1/3'>
                      {" "}
                      {/* Adjust the width as needed */}
                      <CardIntroHeader>
                        <img
                          lazy='true'
                          draggable='false'
                          src={`http://localhost:8000/${courseSrc}`}
                          alt={course?.courseName}
                          className='w-full h-auto'
                        />
                      </CardIntroHeader>
                    </div>
                    <div className='w-2/3 p-5'>
                      <h2 className='text-lg font-bold pb-10'>
                        {course.courseName}
                      </h2>
                      <p>{course?.description}</p>
                    </div>
                    <div className='flex items-center p-6'>
                      {course?.rating}
                      <FaStar className='text-yellow-500 mr-1' />
                    </div>
                  </div>
                </CardIntro>
              </div>
              <Courseinfo
                style={{
                  display: "flex",
                  alignContent: "center",
                  width: "100%",
                }}
              />

              <DescriptionComp />
            </div>
          </div>
        </main>
      )}

      <div className='lg:mx-60'>
        {course?.videos.length === 1 ? (
          <ReactHlsPlayer
            src={`http://localhost:8000/${course?.videos[0].m3u8MasterPath.slice(
              8
            )}`}
            controls
          />
        ) : (
          <div className='flex flex-col lg:flex-row'>
            <ReactHlsPlayer
              src={`http://localhost:8000/${course?.videos[
                activeVideoIndex
              ].m3u8MasterPath.slice(8)}`}
              controls
            />
            <div className='flex flex-wrap mx-4'>
              {course?.videos.map((video, index) => (
                <div key={index} onClick={() => handleVideoClick(index)}>
                  <video
                    src={`http://localhost:8000/${video.m3u8MasterPath.slice(
                      8
                    )}`}
                    className='w-40 cursor-pointer p-2'
                  />
                  <h3>{video.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CoursePage;
