import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Spinner,
  Input,
  getKeyValue,
  Textarea,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Sidebar from "../components/Sidebar";
import { FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

axios.defaults.baseURL = "https://univ-learn.onrender.com";
axios.defaults.withCredentials = true;

function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/admins/courses/");
        setCourses(response.data);
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
          `/api/admins/courses/name/${selectedCourse?._id}`,
          { name: newName }
        );
      }
      const response2 = await axios.put(
        `api/admins/courses/details/${selectedCourse?._id}`,
        courseData
      );

      const response3 = await axios.put(
        `api/admins/courses/photo`,
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
      const response = await axios.delete(
        `api/admins/courses/${selectedCourse?._id}`
      );
      console.log(response);
      alert("Course deleted successfully!");
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-start">
      <Sidebar />
      <div className="grid place-items-center w-full">
        <div className="self-stretch mx-5 mt-8 w-full p-4">
          <Table radius="sm">
            <TableHeader>
              <TableColumn>Thumbnail</TableColumn>
              <TableColumn>Course Name</TableColumn>
              <TableColumn>Total Videos</TableColumn>
              <TableColumn>Total Enrolled</TableColumn>
              <TableColumn align="center">Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No courses to display."}>
              {courses &&
                courses?.map((course) => (
                  <TableRow key={course?._id}>
                    <TableCell>
                      <img
                        src={`http://localhost:8000/${course?.photo.slice(7)}`}
                        alt={course?.courseName}
                        className="w-32 h-16 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>{course?.courseName}</TableCell>
                    <TableCell>{course?.videos?.length}</TableCell>
                    <TableCell>{course?.enrollmentCount}</TableCell>
                    <TableCell>
                      <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                          <span
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                            onClick={() => {
                              setSelectedCourse(course);
                              setSelectedAction("details");
                              onOpen();
                            }}
                          >
                            <FaRegEye />
                          </span>
                        </Tooltip>
                        <Tooltip content="Edit course">
                          <span
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                            onClick={() => {
                              setSelectedCourse(course);
                              setSelectedAction("edit");
                              onOpen();
                            }}
                          >
                            <CiEdit />
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete course">
                          <span
                            className="text-lg text-danger cursor-pointer active:opacity-50"
                            onClick={() => {
                              setSelectedCourse(course);
                              setSelectedAction("delete");
                              onOpen();
                            }}
                          >
                            <MdDeleteOutline />
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="">
            {isLoading && (
              <div className="flex justify-center items-center w-full h-full bg-black/35">
                <Spinner size="lg" />
              </div>
            )}
          </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
          >
            <ModalContent>
              {(onClose) => {
                switch (selectedAction) {
                  case "details":
                    return (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          {`${selectedCourse?.courseName}'s details`}
                        </ModalHeader>
                        <ModalBody>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Course Name</p>
                              <p className="text-sm">
                                {selectedCourse?.courseName}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">
                                Course Description
                              </p>
                              <p className="text-sm">
                                {selectedCourse?.description}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">
                                Course Summary
                              </p>
                              <p className="text-sm">
                                {selectedCourse?.summary}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Faculty</p>
                              <p className="text-sm">
                                {selectedCourse?.faculty}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Department</p>
                              <p className="text-sm">
                                {selectedCourse?.department}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Specialty</p>
                              <p className="text-sm">
                                {selectedCourse?.specialty}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Level</p>
                              <p className="text-sm">{selectedCourse?.level}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">
                                Total Enrollment
                              </p>
                              <p className="text-sm">
                                {selectedCourse?.enrollmentCount}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">
                                Total Videos
                              </p>
                              <p className="text-sm">
                                {selectedCourse?.videos.length}
                              </p>
                            </div>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="primary"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                        </ModalFooter>
                      </>
                    );
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
                                <label htmlFor="courseName">Course Name</label>
                                <Input
                                  id="courseName"
                                  name="newName"
                                  placeholder="Enter course name"
                                  defaultValue={selectedCourse?.courseName}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label htmlFor="description">Description</label>
                                <Textarea
                                  id="description"
                                  name="description"
                                  placeholder="Enter course description"
                                  defaultValue={selectedCourse?.description}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label htmlFor="description">Summary</label>
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
                          <h2>Are you sure you want to delete this course?</h2>
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
        </div>
      </div>
    </div>
  );
}

export default AdminCoursesPage;
