import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "@nextui-org/react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

const ProfilePage = () => {
  const { user } = useAuth();
  const profile = user;
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/courses/enrolled-courses/");
        console.log(res);
        setCourses(res.data.enrolledCourses);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  console.log(courses);
  return (
    <div>
      <NavBar />
      <div className='flex flex-col items-center mb-20'>
        <img
          src={`http://localhost:8000/${profile.profilePicture.slice(7)}`}
          alt='profile picture'
          className='h-48 w-48 mt-12 rounded-full'
        />
        <p className='text-3xl font-semibold mt-4'>{profile.username}</p>
        {/* student or teacher */}
        <p className='text-xl capitalize'>{profile.role}</p>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center my-6'>
            {isLoading ? (
              <div className='w-full h-full flex items-center justify-center'>
                <Spinner size='large' color='primary' />
              </div>
            ) : !courses.length ? (
              <p className='text-2xl text-default-400'>
                Currently no enrolled courses to display.
              </p>
            ) : (
              <div className='flex flex-col gap-4 items-center'>
                <p className='font-medium'>My courses</p>
                <div className='grid grid-cols-3 gap-6 px-32'>
                  {courses?.map((course) => {
                    console.log(course);
                    return (
                      <div
                        key={course?.courseName}
                        className='flex flex-col items-center'
                      >
                        <img
                          src={`http://localhost:8000/${course?.photo.slice(
                            7
                          )}`}
                          alt='course thumbnail'
                          className='w-64 rounded-lg object-cover'
                        />
                        <p className='text-xl mt-2'>{course?.courseName}</p>
                        <div className='flex justify-between items-center'>
                          <div className='h-[15px] w-[350px] rounded-full bg-[#d9d9d9]'>
                            <div
                              className={`h-[15px] bg-[#5D61D0] rounded-full`}
                              style={{ width: Math.floor(Math.random() * 100) }}
                            ></div>
                          </div>
                          <p>{course.progres}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
