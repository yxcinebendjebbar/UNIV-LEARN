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
        <h2 className='text-xl font-medium my-4 self-start mx-8'>
          Continue where you left of:
        </h2>
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
                <div className='grid grid-cols-3 gap-6 px-32'>
                  {courses?.map((course) => {
                    console.log(course);
                    return (
                      <div
                        key={course?.courseId}
                        className='flex flex-col items-center justify-between rounded-lg bg-white cursor-pointer'
                        onClick={() => {
                          window.location.href = `/courses/${course?.courseId}`;
                        }}
                      >
                        <img
                          src={`http://localhost:8000/${course?.photo.slice(
                            7
                          )}`}
                          alt='course thumbnail'
                          className='w-64 rounded-lg object-cover'
                        />
                        <p className='text-xl font-medium m-4 text-center'>
                          {course?.courseName}
                        </p>
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
