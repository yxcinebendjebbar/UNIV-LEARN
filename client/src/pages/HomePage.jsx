import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Card, CardHeader, CardContent, CardFooter } from "../components/Card";

axios.defaults.baseURL = "http://localhost:8000";

const fakeCourseData = [
  {
    _id: 1,
    name: "Course 1",
    description: "This is a description for course 1",
    instructor: "Instructor 1",
    rating: 9,
    totalReviews: 100,
    photo: "https://via.placeholder.com/150",
  },
  {
    _id: 2,
    name: "Course 2",
    description: "This is a description for course 2",
    instructor: "Instructor 2",
    rating: 7.5,
    totalReviews: 100,
    photo: "https://via.placeholder.com/150",
  },
  {
    _id: 3,
    name: "Course 3",
    description: "This is a description for course 3",
    instructor: "Instructor 3",
    rating: 9.5,
    totalReviews: 100,
    photo: "https://via.placeholder.com/150",
  },
  {
    _id: 4,
    name: "Course 4",
    description: "This is a description for course 4",
    instructor: "Instructor 4",
    rating: 8.5,
    totalReviews: 100,
    photo: "https://via.placeholder.com/150",
  },
];

const fakeProfData = [
  {
    _id: 1,
    fullName: "Prof 1",
    profilePic: "https://via.placeholder.com/150",
    courses: ["Course 1", "Course 2", "Course 2"],
  },
  {
    _id: 2,
    fullName: "Prof 2",
    profilePic: "https://via.placeholder.com/150",
    courses: ["Course 3", "Course 4", "Course 2", "Course 2"],
  },
  {
    _id: 3,
    fullName: "Prof 3",
    profilePic: "https://via.placeholder.com/150",
    courses: ["Course 5", "Course 6"],
  },
  {
    _id: 4,
    fullName: "Prof 4",
    profilePic: "https://via.placeholder.com/150",
    courses: ["Course 7"],
  },
  {
    _id: 5,
    fullName: "Prof 5",
    profilePic: "https://via.placeholder.com/150",
    courses: ["Course 8"],
  },
];

const fakeLearningPathData = [
  {
    _id: 1,
    name: "Learning Path 1",
    description: "This is a description for learning path 1",
    courses: ["Course 1", "Course 2", "Course 3"],
    photo: "https://via.placeholder.com/150",
  },
  {
    _id: 2,
    name: "Learning Path 2",
    description: "This is a description for learning path 2",
    courses: ["Course 4", "Course 5", "Course 6"],
    photo: "https://via.placeholder.com/150",
  },
  {
    _id: 3,
    name: "Learning Path 3",
    description: "This is a description for learning path 3",
    courses: ["Course 7", "Course 8", "Course 9"],
    photo: "https://via.placeholder.com/150",
  },
  {
    _id: 4,
    name: "Learning Path 4",
    description: "This is a description for learning path 4",
    courses: ["Course 10", "Course 11", "Course 12"],
    photo: "https://via.placeholder.com/150",
  },
];

function HomePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get("/api/courses/", { withCredentials: true })
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  console.log(courses);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const topCourses = courses.sort(
    (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
  );

  const slicedTopCourses = topCourses.slice(0, 4);

  const mostActiveProfs = fakeProfData.sort(
    (a, b) => b.courses.length - a.courses.length
  );

  return (
    <div>
      <NavBar />
      HomePage
    </div>
  );
}

export default HomePage;
