import { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

const ProfilePage = () => {
  const [courses, setCourses] = useState([]);
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res = await axios.post("/api/courses/enrolled-courses/");
        const res2 = await axios.post("/api/courses/favoriteCourses");
        setCourses(res.data.enrolledCourses);
        setFavoriteCourses(res2.data.favoriteCourses);
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

  return (
    <div>
      <NavBar />
      <main className='flex flex-col items-center mb-20'>
        <h2 className='text-xl font-medium my-4 self-start mx-8'>
          Favorite Courses:
        </h2>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center my-6'>
            {isLoading ? (
              <div className='w-full h-full flex items-center justify-center'>
                <Spinner size='large' color='primary' />
              </div>
            ) : !favoriteCourses.length ? (
              <p className='text-2xl text-default-400'>
                Currently no favorite courses to display.
              </p>
            ) : (
              <div className='flex flex-col gap-4 items-center'>
                <div className='flex flex-wrap gap-6 px-16'>
                  {favoriteCourses?.map((course) => {
                    return (
                      <div
                        key={course?.courseId}
                        className='flex flex-col items-center justify-between rounded-lg bg-white shadow dark:shadow-white/5 dark:bg-neutral-950 max-w-80 cursor-pointer'
                        onClick={() => {
                          window.location.href = `/courses/${course?.courseId}`;
                        }}
                      >
                        <img
                          src={`http://localhost:8000/${course?.photo.slice(
                            7
                          )}`}
                          alt='course thumbnail'
                          className=' rounded-lg object-cover'
                        />
                        <p className='text-xl font-medium py-4 text-center'>
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
      </main>
      <section className='flex flex-col items-center mb-20'>
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
                <div className='flex flex-wrap gap-6 px-32'>
                  {courses?.map((course) => {
                    return (
                      <div
                        key={course?.courseId}
                        className='flex flex-col items-center justify-between rounded-lg bg-white shadow dark:shadow-white/5 dark:bg-neutral-950 max-w-80 cursor-pointer'
                        onClick={() => {
                          window.location.href = `/courses/${course?.courseId}`;
                        }}
                      >
                        <img
                          src={`http://localhost:8000/${course?.photo.slice(
                            7
                          )}`}
                          alt='course thumbnail'
                          className='rounded-lg object-cover'
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
      </section>
      <Footer />
    </div>
  );
};

export default ProfilePage;
