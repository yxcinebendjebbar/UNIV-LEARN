import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import axios from "axios";
import { Spinner, Textarea } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { useAuth } from "../hooks/useAuth.jsx";
import { MdEdit, MdDelete } from "react-icons/md";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://univ-learn.onrender.com";
export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [thumbnailSrc, setThumbnailSrc] = useState("");

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a new FileReader object
      reader.onload = () => {
        // Set the thumbnailSrc state with the data URL of the selected file
        setThumbnailSrc(reader.result);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

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

  const updateCourse = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target;
    const formData = new FormData(form);

    const newName = formData.get("newName");

    const courseData = {
      description: formData.get("description"),
      summary: formData.get("summary"),
      faculty: formData.get("faculty"),
      department: formData.get("department"),
      specialty: formData.get("specialty"),
      level: formData.get("level"),
    };

    const coursePhoto = formData.get("thumbnail");

    console.log(selectedCourse?.courseName);

    try {
      let response;
      if (selectedCourse?.courseName !== newName) {
        response = await axios.put(
          `/api/courses/update/name/${selectedCourse?._id}`,
          { name: newName }
        );
      }
      const response2 = await axios.put(
        `api/courses/update/details/${selectedCourse?._id}`,
        courseData
      );

      const response3 = await axios.put(
        `api/courses/update/photoandvideo/${selectedCourse?._id}`,
        {
          name: selectedCourse?.courseName,
          userId: selectedCourse?.userId,
          courseId: selectedCourse?._id,
          photo: coursePhoto,
        },

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      console.log(response2);
      console.log(response3);
      alert("Course updated successfully!");
      location.reload();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async () => {
    try {
      const response = await axios.delete(`api/courses/${selectedCourse?._id}`);
      console.log(response);
      alert("Course deleted successfully!");
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className=" min-h-screen w-full ">
        <div className="flex flex-col">
          <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
            <a className="lg:hidden" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
                <path d="M12 3v6"></path>
              </svg>
              <span className="sr-only">Home</span>
            </a>
            <div className="flex-1">
              <h1 className="font-semibold text-lg">Courses</h1>
            </div>
            <nav className="flex items-center gap-4 md:gap-2 lg:gap-4">
              <a
                className="rounded-lg border border-gray-200  px-3 py-2 text-sm  dark:border-gray-800"
                href="/new-course"
              >
                Add New Course
              </a>
            </nav>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="border shadow-sm rounded-lg">
              <div className="grid items-center grid-cols-[100px_1fr_100px_100px] px-4 py-2 md:grid-cols-[100px_1fr_150px_150px] dark:grid-cols-[100px_1fr_150px_150px] gap-x-4">
                <div className="md:font-medium">Thumbnail</div>
                <div className="md:font-medium">Title</div>
                <div className="md:font-medium">Rating</div>
                <div className="md:font-medium">Actions</div>
              </div>

              <div className="grid items-center grid-cols-[100px_1fr_100px_100px] px-4 py-2 md:grid-cols-[100px_1fr_150px_150px] dark:grid-cols-[100px_1fr_150px_150px] gap-x-4">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Spinner size="lg" color="primary" />
                  </div>
                ) : myCourses ? (
                  myCourses?.map((course) => {
                    const courseSrc = course?.photo.slice(8);
                    return (
                      <>
                        <div>
                          <img
                            src={`https://univ-learn.onrender.com/${courseSrc}`}
                            width="100"
                            height="60"
                            alt={course?.courseName}
                            className="rounded-md aspect-video overflow-hidden object-cover border"
                          />
                        </div>
                        <div className="truncate">{course?.courseName}</div>
                        <div className="truncate">{course?.rating}</div>
                        <div className="flex gap-4">
                          <button
                            className="p-2 rounded-lg"
                            onClick={() => {
                              setSelectedAction("edit");
                              setSelectedCourse(course);
                              onOpen();
                            }}
                          >
                            <MdEdit />
                          </button>
                          <button
                            className="p-2 rounded-lg"
                            onClick={() => {
                              setSelectedAction("delete");
                              setSelectedCourse(course);
                              onOpen();
                            }}
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div className="text-center w-full">No courses found</div>
                )}
              </div>
            </div>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              scrollBehavior="inside"
            >
              <ModalContent>
                {(onClose) => {
                  switch (selectedAction) {
                    case "edit":
                      return (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            {`Editing course's details`}
                          </ModalHeader>
                          <ModalBody>
                            <form onSubmit={updateCourse}>
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="courseName">
                                    Course Name
                                  </label>
                                  <Input
                                    id="courseName"
                                    name="newName"
                                    placeholder="Enter course name"
                                    defaultValue={selectedCourse?.courseName}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="description">
                                    Description
                                  </label>
                                  <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter course description"
                                    defaultValue={selectedCourse?.description}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="summary">Summary</label>
                                  <Textarea
                                    id="summary"
                                    name="summary"
                                    placeholder="Enter course summary"
                                    defaultValue={selectedCourse?.summary}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="faculty">Faculty</label>
                                  <Input
                                    id="faculty"
                                    name="faculty"
                                    placeholder="Enter faculty"
                                    defaultValue={selectedCourse?.faculty}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="department">Department</label>
                                  <Input
                                    id="department"
                                    name="department"
                                    placeholder="Enter department"
                                    defaultValue={selectedCourse?.department}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="specialty">Specialty</label>
                                  <Input
                                    id="specialty"
                                    name="specialty"
                                    placeholder="Enter specialty"
                                    defaultValue={selectedCourse?.specialty}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="level">Level</label>
                                  <Input
                                    id="level"
                                    placeholder="Enter level"
                                    name="level"
                                    defaultValue={selectedCourse?.level}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <label htmlFor="thumbnail">Thumbnail</label>
                                  <input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    onChange={handleThumbnailChange}
                                  />

                                  <img
                                    src={
                                      thumbnailSrc ||
                                      "https://via.placeholder.com/150x150"
                                    }
                                    className="h-40 object-cover rounded-lg"
                                  />
                                </div>
                              </div>
                              <Button
                                radius="sm"
                                color="primary"
                                className="w-full mt-2"
                                type="submit"
                              >
                                Edit
                              </Button>
                            </form>
                          </ModalBody>
                          <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                              Close
                            </Button>
                          </ModalFooter>
                        </>
                      );
                    case "delete":
                      return (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            {`Deleting ${selectedCourse?.courseName}`}
                          </ModalHeader>
                          <ModalBody>
                            <h2>
                              Are you sure you want to delete this course?
                            </h2>
                          </ModalBody>
                          <ModalFooter>
                            <Button
                              color="primary"
                              variant="light"
                              onPress={onClose}
                            >
                              Close
                            </Button>
                            <Button
                              color="danger"
                              onPress={onClose}
                              onClick={deleteCourse}
                            >
                              Delete
                            </Button>
                          </ModalFooter>
                        </>
                      );
                  }
                }}
              </ModalContent>
            </Modal>
          </main>
        </div>
      </div>
    </>
  );
}
