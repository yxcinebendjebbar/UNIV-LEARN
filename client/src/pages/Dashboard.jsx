import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.jsx";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import { useAuth } from "../hooks/useAuth.jsx";
import { MdEdit, MdDelete } from "react-icons/md";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/courses/teacher-courses/${user.id}`
        );
        setMyCourses(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <>
      <NavBar />
      <div className=' min-h-screen w-full '>
        <div className='flex flex-col'>
          <header className='flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40'>
            <a className='lg:hidden' href='#'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path d='M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z'></path>
                <path d='m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9'></path>
                <path d='M12 3v6'></path>
              </svg>
              <span className='sr-only'>Home</span>
            </a>
            <div className='flex-1'>
              <h1 className='font-semibold text-lg'>Courses</h1>
            </div>
            <nav className='flex items-center gap-4 md:gap-2 lg:gap-4'>
              <a
                className='rounded-lg border border-gray-200  px-3 py-2 text-sm  dark:border-gray-800'
                href='/new-course'
              >
                Add New Course
              </a>
            </nav>
          </header>
          <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6'>
            <div className='border shadow-sm rounded-lg'>
              <div className='grid items-center grid-cols-[100px_1fr_100px_100px] px-4 py-2 md:grid-cols-[100px_1fr_150px_150px] dark:grid-cols-[100px_1fr_150px_150px] gap-x-4'>
                <div className='md:font-medium'>Thumbnail</div>
                <div className='md:font-medium'>Title</div>
                <div className='md:font-medium'>Rating</div>
                <div className='md:font-medium'>Actions</div>
              </div>

              <div className='grid items-center grid-cols-[100px_1fr_100px_100px] px-4 py-2 md:grid-cols-[100px_1fr_150px_150px] dark:grid-cols-[100px_1fr_150px_150px] gap-x-4'>
                {isLoading ? (
                  <div className='w-full h-full flex items-center justify-center'>
                    <Spinner size='lg' color='primary' />
                  </div>
                ) : myCourses ? (
                  myCourses?.map((course) => {
                    const courseSrc = course?.photo.slice(8);
                    return (
                      <>
                        <div>
                          <img
                            src={`http://localhost:8000/${courseSrc}`}
                            width='100'
                            height='60'
                            alt={course?.courseName}
                            className='rounded-md aspect-video overflow-hidden object-cover border'
                          />
                        </div>
                        <div className='truncate'>{course?.courseName}</div>
                        <div className='truncate'>{course?.rating}</div>
                        <div className='flex gap-4'>
                          <button className='p-2 rounded-lg'>
                            <MdEdit />
                          </button>
                          <button className='p-2 rounded-lg'>
                            <MdDelete />
                          </button>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div className='text-center w-full'>No courses found</div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
