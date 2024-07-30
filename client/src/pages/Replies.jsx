import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://univ-learn.onrender.com";
const fakethreadData = [
  {
    _id: 1,
    name: "Edison",
    title: "I have issue with Algorithmes",
    numberOfLikes: 23,
    numberOfComments: 4,
  },
];

const Replies = () => {
  const { id } = useParams();
  const [thread, setThread] = useState({});
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/forums/${id}`);
        console.log(response);
        setThread(response.data.forum);
        setReplies(response.data.replies);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThread();
  }, []);

  console.log(thread);
  console.log(replies);
  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (reply.trim() !== "") {
      try {
        const response = axios.post(`/api/reply/${thread?._id}/replies`, {
          content: reply,
        });
        setReplies([...replies, response.data]);
        setReply("");
        console.log(response);
        alert("Reply sent successfully");
        location.reload();
      } catch (error) {
        console.error(error);
        alert("An error occurred while sending your reply");
      }
    }
  };

  return (
    <div>
      <NavBar />
      {isLoading && (
        <div className="flex justify-center items-center mt-20">
          <Spinner size="large" />
        </div>
      )}
      {thread && (
        <div className=" w-full block   mx-auto p-8 bg-white dark:bg-neutral-800 shadow-lg ">
          <div className=" flex justify-between items-center">
            <p className=" w-full mx-auto p-4 font-medium text-3xl ">
              {thread?.title}
            </p>
            <div className="font-medium w-48 text-gray-400">
              <p className="flex "> BY {thread?.createdBy?.fullName}</p>
            </div>
          </div>
          <p className=" max-w-4xl mx-auto p-4 bg-white dark:bg-neutral-700 shadow-lg rounded-lg ml-2 mb-6">
            {thread?.description}
          </p>
        </div>
      )}
      <h2 className=" text-2xl font-semibold absolute top-72 left-[45%]">
        Replies
      </h2>
      <div className="block max-w-4xl  mx-auto p-8 bg-white dark:bg-neutral-800 shadow-lg rounded-lg mt-20 overflow-y-scroll h-[35rem]">
        {replies &&
          replies.map((reply) => (
            <div key={reply?._id} className=" block items-center">
              <div className="flex font-bold  text-gray-400">
                <p> {reply?.authorId?.fullName}</p>
              </div>
              <p className=" max-w-4xl mx-auto p-4 bg-white dark:bg-neutral-700 shadow-lg rounded-lg ml-2 mb-6">
                {reply?.content}
              </p>
            </div>
          ))}
        {!replies.length && (
          <p className="text-gray-400 text-center">No replies yet...</p>
        )}
      </div>
      <main className=" my-8 flex justify-center items-center">
        <div className="max-w-4xl w-full bg-white dark:bg-neutral-800 p-8 shadow-lg rounded-lg">
          <form onSubmit={handleSubmitReply}>
            <label htmlFor="reply" className="block mb-2 font-medium">
              Reply to the thread
            </label>
            <textarea
              rows={5}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              type="text"
              name="reply"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              SEND
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Replies;
