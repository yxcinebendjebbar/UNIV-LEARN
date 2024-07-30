import { React, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactHlsPlayer from "react-hls-player";
import { Spinner } from "@nextui-org/react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
import { FaStar } from "react-icons/fa";
import { CardIntro, CardIntroHeader } from "../components/CardIntro";
import { Courseinfo } from "../components/Courseinfo";
import DescriptionComp from "../components/DescriptionComp";

axios.defaults.baseURL = "https://univ-learn.onrender.com";
axios.defaults.withCredentials = true;

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

  let courseSrc = course?.photo.slice(8);

  return (
    <div className="Course page">
      <Navbar />
      {!course ? (
        <div className="h-full w-full bg-black/35">
          <Spinner />
        </div>
      ) : (
        <main className="mx-300 md:px-24 mt-32 pb-8 items-center">
          <div className="flex flex-wrap gap-8 justify-center items-center">
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
                  classNames="bg-white cursor-pointer dark:bg-neutral-800 w-full border dark:border-neutral-600 shadow-lg dark:shadow-white/5"
                >
                  <div className="flex">
                    <div className="w-1/3">
                      {" "}
                      {/* Adjust the width as needed */}
                      <CardIntroHeader>
                        <img
                          lazy="true"
                          draggable="false"
                          src={`https://univ-learn.onrender.com/${courseSrc}`}
                          alt={course?.courseName}
                          className="w-full h-auto"
                        />
                      </CardIntroHeader>
                    </div>
                    <div className="w-2/3 p-5">
                      <h2 className="text-lg font-bold pb-10">
                        {course.courseName}
                      </h2>
                      <p>{course?.description}</p>
                    </div>
                    <div className="flex items-center p-6">
                      {course?.rating}
                      <FaStar className="text-yellow-500 mr-1" />
                    </div>
                  </div>
                </CardIntro>
              </div>
              <Courseinfo
                profileData={course?.userId}
                statData={course?.enrollmentCount}
                style={{
                  display: "flex",
                  alignContent: "center",
                  width: "100%",
                }}
              />

              <DescriptionComp summary={course?.summary} />
            </div>
          </div>
        </main>
      )}

      <div className="lg:mx-60">
        {course?.videos.length === 1 ? (
          <ReactHlsPlayer
            src={`https://univ-learn.onrender.com/${course?.videos[0].m3u8MasterPath.slice(
              8
            )}`}
            controls
          />
        ) : (
          <div className="flex flex-col lg:flex-row">
            <ReactHlsPlayer
              src={`https://univ-learn.onrender.com/${course?.videos[
                activeVideoIndex
              ].m3u8MasterPath.slice(8)}`}
              controls
            />
            <div className="flex flex-wrap mx-4">
              {course?.videos.map((video, index) => (
                <div key={index} onClick={() => handleVideoClick(index)}>
                  <video
                    src={`https://univ-learn.onrender.com/${video.m3u8MasterPath.slice(
                      8
                    )}`}
                    className="w-40 cursor-pointer p-2"
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
