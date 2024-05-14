import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Likes from "../components/Likes";
import Comments from "../components/Comments";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

const ForumsPage = () => {
  const [threads, setThreads] = useState([]);
  const [threadTitle, setThreadTitle] = useState("");
  const [threadDesc, setThreadDesc] = useState("");
  const [isNewThread, setIsNewThread] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await axios.get("/api/forums/");

        console.log(response);
        setThreads(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchThreads();
  }, []);

  const postThread = async () => {
    try {
      const response = await axios.post("/api/forums/create", {
        title: threadTitle,
        description: threadDesc,
      });
      console.log(response);

      alert("Thread created successfully");
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    postThread();
    setThreadTitle("");
    setThreadDesc("");
    setIsNewThread(true);
    location.reload();
  };

  return (
    <>
      <NavBar />
      <main className='bg-gray-100 dark:bg-neutral-900 pt-20 min-h-screen'>
        {user && user.role === "teacher" && (
          <div className='max-w-4xl mx-auto p-8 bg-white dark:bg-neutral-800 shadow-lg rounded-lg mb-8'>
            <h2 className='text-2xl font-semibold dark:text-white  text-gray-800 mb-4'>
              Create a Thread
            </h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label
                  htmlFor='threadTitle'
                  className='block text-gray-700 font-medium mb-2'
                >
                  Title
                </label>
                <input
                  type='text'
                  name='threadTitle'
                  required
                  value={threadTitle}
                  onChange={(e) => setThreadTitle(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300  focus:outline-none focus:border-blue-500'
                />
                <label
                  htmlFor='threadDesc'
                  className='block text-gray-700 font-medium mb-2'
                >
                  Description
                </label>
                <textarea
                  type='text'
                  name='threadDesc'
                  required
                  value={threadDesc}
                  onChange={(e) => setThreadDesc(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300  focus:outline-none focus:border-blue-500'
                />
              </div>
              <button
                type='submit'
                className='bg-gray-500 text-white py-2 px-4 rounded-sm hover:bg-blue-800 focus:outline-none focus:bg-blue-100'
              >
                CREATE THREAD
              </button>
            </form>
          </div>
        )}
        <div className='max-w-4xl mx-auto'>
          {threads &&
            threads.map((thread, index) => (
              <div key={thread._id} className='mb-4'>
                <Link
                  to={`/replies/${thread._id}`}
                  className='justify-between  flex bg-white dark:bg-neutral-800 shadow-lg rounded-lg mb-1 p-4 hover:bg-gray-500 transition duration-300 cursor-pointer'
                >
                  <h3 className='text-xl font-semibold text-gray-800 dark:text-white'>
                    {thread.title}
                  </h3>
                  <div className='flex justify-end text-gray-500 ml-2 mr-2'>
                    {isNewThread && index < 1 && (
                      <div className='bg-blue-500 text-white mr-5 px-2 py-1  rounded'>
                        New
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}

          {!threads.length && (
            <div className='bg-white shadow-lg rounded-lg p-4 text-center'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                No threads found
              </h2>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForumsPage;
