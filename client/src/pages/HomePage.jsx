import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Card, CardHeader, CardContent, CardFooter } from "../components/Card";

axios.defaults.baseURL = "https://univ-learn.onrender.com";
function HomePage() {
  const [courses, setCourses] = useState([]);
  const [profs, setProfs] = useState([]);

  useEffect(() => {
    const fetchCoursesAndProfs = async () => {
      try {
        const response1 = await axios.get("/api/courses/", {
          withCredentials: true,
        });
        const response2 = await axios.get("/api/users/profs/", {
          withCredentials: true,
        });

        if (response1) {
          console.log(response1.data);
          setCourses(response1.data);
        }
        if (response2) {
          console.log(response2.data);
          setProfs(response2.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCoursesAndProfs();
  }, []);

  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const topCourses = courses.sort(
    (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
  );
  const enrollCourse = async (id) => {
    try {
      const response = await axios.post(`api/courses/enroll`, {
        courseId: id,
      });
      navigate(`/courses/${id}`);
    } catch (error) {
      console.error(error);
      navigate(`/courses/${id}`);
    }
  };

  const slicedTopCourses = topCourses.slice(0, 4);

  const mostActiveProfs = profs.sort(
    (a, b) => b.courses.length - a.courses.length
  );

  console.log(mostActiveProfs);

  return (
    <div>
      <NavBar />
      <main className="mx-8 md:px-24 mt-32 pb-8">
        <div className="border-b border-black dark:border-neutral-500 mb-1 flex justify-between items-center">
          <h2 className="mb-4 text-header">Top Courses</h2>
          <button
            className="Bordered"
            onClick={() => {
              navigate("/courses");
            }}
          >
            See more
          </button>
        </div>
        <p className="text-subheader mb-8">
          Explore the trendiest courses of the month right here on our platform!
        </p>
        <div className="flex flex-wrap gap-8 justify-center items-start">
          {slicedTopCourses.map((course) => {
            let courseSrc = course?.photo.slice(8);
            return (
              <Card
                key={course?._id}
                classNames="bg-white dark:bg-neutral-800 w-[282px] border dark:border-neutral-600 shadow-lg dark:shadow-white/5"
              >
                <CardHeader classNames="border-b">
                  <img
                    lazy="true"
                    draggable="false"
                    src={`http://localhost:8000/${courseSrc}`}
                    alt={course?.courseName}
                    className="w-full h-[177px] object-cover"
                  />
                </CardHeader>
                <CardContent classNames="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">
                        {course?.courseName}
                      </h2>
                      <p className="text-sm text-neutral-500">
                        {course.instructor}
                      </p>
                    </div>
                    <p className="flex items-center">
                      {course.rating} <FaStar color="yellow" />
                    </p>
                  </div>
                  <p className="">{course?.description}</p>
                </CardContent>
                <CardFooter classNames="p-4 flex justify-center items-center">
                  <button
                    className="Solid"
                    onClick={() => {
                      enrollCourse(course?._id);
                    }}
                  >
                    Enroll now
                  </button>
                  <button
                    className="Light"
                    onClick={() => {
                      navigate(`/courses/${course?._id}`);
                    }}
                  >
                    View course
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
      <section className="mx-8 md:px-24 mt-32 pb-8">
        <div className="border-b border-black dark:border-neutral-500 mb-1 flex justify-between items-center">
          <h2 className="mb-4 text-header">Most Active Trainers</h2>
          <button
            className="Bordered"
            onClick={() => {
              navigate("/courses");
            }}
          >
            See more
          </button>
        </div>
        <p className="text-subheader mb-8">
          Discover the most active trainers of the month right here on our
          platform!{" "}
        </p>
        <div className="flex flex-wrap justify-center items-start gap-8">
          {mostActiveProfs.map((prof) => {
            return (
              <div className="flex flex-col justify-center items-center">
                <img
                  src={`http://localhost:8000/${prof.profilePicture[0].slice(
                    7
                  )}`}
                  alt={prof.name[0]}
                  className="rounded-full w-52"
                  draggable="false"
                />
                <h2 className="text-lg font-bold w-32 text-center align-middle">
                  {prof.name[0]}
                </h2>
              </div>
            );
          })}
        </div>
      </section>
      <section className="mx-8 md:px-24 mt-32 pb-8">
        <div className="border-b border-black dark:border-neutral-500 mb-1 flex justify-between items-center">
          <h2 className="mb-4 text-header">Browse Forums</h2>
          <button
            className="Solid"
            onClick={() => {
              navigate("/forums");
            }}
          >
            Browse
          </button>
        </div>
        <p className="text-subheader mb-8">
          Explore this month's top forum discussions! Engage with trending
          topics, share insights, and learn from the community's expertise. Join
          the conversation now!
        </p>
      </section>
      <Footer />
    </div>
  );
}

export default HomePage;
