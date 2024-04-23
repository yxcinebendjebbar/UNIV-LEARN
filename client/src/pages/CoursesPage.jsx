import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { IoMdSearch } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  RadioGroup,
  Radio,
  Button,
} from "@nextui-org/react";
import { Card, CardHeader, CardContent, CardFooter } from "../components/Card";

axios.defaults.baseURL = "http://localhost:8000";

const SearchBar = ({ setSearchText }) => {
  return (
    <div className='flex justify-center items-center gap-3 m-4 min-w-20 lg:mx-80 lg:min-w-32 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-neutral-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 lg:my-32'>
      <IoMdSearch className='scale-150' />
      <input
        type='text'
        placeholder='Search for courses'
        onChange={(e) => setSearchText(e.target.value)}
        className='bg-transparent w-full focus:outline-none h-full'
      />
      <button className='Light'>Search</button>
    </div>
  );
};

const scienceDepartments = [
  "None",
  "Mathematics",
  "Computer Science",
  "Physics",
  "Chemistry",
];

const csSpecialities = [
  "None",
  "Software Engineering",
  "Artificial Intelligence",
  "Network and Telecoms",
];

const mathSpecialties = ["None", "Pure Mathematics", "Applied Mathematics"];

const physicsSpecialties = [
  "None",
  "Astrophysics",
  "Quantum Physics",
  "Nuclear Physics",
];

const chemistrySpecialties = [
  "None",
  "Organic Chemistry",
  "Inorganic Chemistry",
  "Physical Chemistry",
];

const medicineDepartments = [
  "None",
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pharmacology",
];

const anatomySpecialties = [
  "None",
  "Neuroanatomy",
  "Gross Anatomy",
  "Embryology",
];

const physiologySpecialties = [
  "None",
  "Cardiovascular Physiology",
  "Respiratory Physiology",
  "Renal Physiology",
];

const biochemistrySpecialties = [
  "None",
  "Molecular Biology",
  "Genetics",
  "Metabolism",
];

const pharmacologySpecialties = [
  "None",
  "Pharmacokinetics",
  "Pharmacodynamics",
  "Pharmacogenetics",
];

const economicsDepartments = [
  "None",
  "Accounting",
  "Economics",
  "Business Administration",
  "Finance",
];

const accountingSpecialties = [
  "None",
  "Financial Accounting",
  "Cost Accounting",
  "Management Accounting",
];

const economicsSpecialties = [
  "None",
  "Microeconomics",
  "Macroeconomics",
  "Development Economics",
];

const businessSpecialties = [
  "None",
  "Marketing",
  "Management",
  "Human Resources",
];

const financeSpecialties = [
  "None",
  "Corporate Finance",
  "Investment Banking",
  "Financial Markets",
];

function CoursesPage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [selectedLevelKey, setSelectedLevelKey] = useState("None");
  const [selectedFacultyKey, setSelectedFacultyKey] = useState("None");
  const [selectedDepartmentKey, setSelectedDepartmentKey] = useState("None");
  const [selectedSpecialtyKey, setSelectedSpecialtyKey] = useState("None");

  const [searchText, setSearchText] = useState("");

  const handleReset = () => {
    setSelectedLevelKey("None");
    setSelectedFacultyKey("None");
    setSelectedDepartmentKey("None");
    setSelectedSpecialtyKey("None");
  };

  useEffect(() => {
    const fetchCourses = async () => {
      await axios
        .get("/api/courses/", {
          withCredentials: true,
        })
        .then((res) => {
          setCourses(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchCourses();
  }, []);

  const enrollCourse = async (id) => {
    try {
      const response = await axios.post(`api/courses/enroll`, {
        courseId: id,
      });
      alert(response.data.message);
      navigate(`/courses/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(courses);

  const filteredCourses = useMemo(() => {
    let filtered = [...courses];

    // Filter by search text

    if (searchText) {
      filtered = filtered.filter((course) => {
        return course.name.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    // Filter by Faculty
    if (selectedFacultyKey !== "None") {
      filtered = filtered.filter((course) => {
        return course.faculty === selectedFacultyKey;
      });
    }

    // Filter by Department
    if (selectedDepartmentKey !== "None") {
      filtered = filtered.filter((course) => {
        return course.department === selectedDepartmentKey;
      });
    }

    // Filter by Specialty
    if (selectedSpecialtyKey !== "None") {
      filtered = filtered.filter((course) => {
        return course.specialty === selectedSpecialtyKey;
      });
    }

    if (selectedLevelKey !== "None") {
      filtered = filtered.filter((course) => {
        return course.level === selectedLevelKey;
      });
    }
    if (
      selectedFacultyKey !== "None" &&
      selectedDepartmentKey !== "None" &&
      selectedSpecialtyKey !== "None" &&
      selectedLevelKey !== "None"
    ) {
      // Filter by Faculty, Department, Specialty, and Level
      filtered = filtered.filter((course) => {
        return (
          course.faculty === selectedFacultyKey &&
          course.department === selectedDepartmentKey &&
          course.specialty === selectedSpecialtyKey &&
          course.level === selectedLevelKey
        );
      });
    }

    return filtered;
  }, [
    courses,
    searchText,
    selectedLevelKey,
    selectedFacultyKey,
    selectedDepartmentKey,
    selectedSpecialtyKey,
  ]);

  return (
    <div>
      <NavBar />
      <SearchBar setSearchText={setSearchText} />
      <main className='px-4 lg:px-32 mb-8'>
        <h2 className='text-header mb-8'>Browse Courses</h2>
        <div className='p-4 mb-8 bg-white relative dark:bg-neutral-700 border border-neutral-500 rounded flex flex-wrap items-center gap-4'>
          <Dropdown radius='sm'>
            <DropdownTrigger>
              <Button
                radius='sm'
                variant='light'
                color='default'
                className='font-medium'
              >
                Faculty: {selectedFacultyKey}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>
                <RadioGroup
                  defaultValue={selectedFacultyKey}
                  onValueChange={setSelectedFacultyKey}
                >
                  <Radio value='None'>None</Radio>
                  <Radio value='Faculty of Science'>Faculty of Science</Radio>
                  <Radio value='Faculty of Medicine'>Faculty of Medicine</Radio>
                  <Radio value='Faculty of Economics'>
                    Faculty of Economics
                  </Radio>
                </RadioGroup>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown radius='sm'>
            <DropdownTrigger>
              <Button
                radius='sm'
                variant='light'
                color='default'
                className='font-medium'
              >
                Department: {selectedDepartmentKey}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>
                <RadioGroup
                  defaultValue={selectedDepartmentKey}
                  onValueChange={setSelectedDepartmentKey}
                >
                  {selectedFacultyKey === "None" && (
                    <Radio value='None'>None</Radio>
                  )}
                  {selectedFacultyKey === "Faculty of Science" &&
                    scienceDepartments.map((dept) => (
                      <Radio key={dept} value={dept}>
                        {dept}
                      </Radio>
                    ))}
                  {selectedFacultyKey === "Faculty of Medicine" &&
                    medicineDepartments.map((dept) => (
                      <Radio key={dept} value={dept}>
                        {dept}
                      </Radio>
                    ))}
                  {selectedFacultyKey === "Faculty of Economics" &&
                    economicsDepartments.map((dept) => (
                      <Radio key={dept} value={dept}>
                        {dept}
                      </Radio>
                    ))}
                </RadioGroup>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown radius='sm'>
            <DropdownTrigger>
              <Button
                radius='sm'
                variant='light'
                color='default'
                className='font-medium'
              >
                Specialty: {selectedSpecialtyKey}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>
                <RadioGroup
                  defaultValue={selectedSpecialtyKey}
                  onValueChange={setSelectedSpecialtyKey}
                >
                  {selectedDepartmentKey === "None" && (
                    <Radio value='None'>None</Radio>
                  )}
                  {selectedDepartmentKey === "Computer Science" &&
                    csSpecialities.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Mathematics" &&
                    mathSpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Physics" &&
                    physicsSpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Chemistry" &&
                    chemistrySpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Anatomy" &&
                    anatomySpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Physiology" &&
                    physiologySpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Biochemistry" &&
                    biochemistrySpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Pharmacology" &&
                    pharmacologySpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Accounting" &&
                    accountingSpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Economics" &&
                    economicsSpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Business Administration" &&
                    businessSpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                  {selectedDepartmentKey === "Finance" &&
                    financeSpecialties.map((specialty) => (
                      <Radio key={specialty} value={specialty}>
                        {specialty}
                      </Radio>
                    ))}
                </RadioGroup>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown radius='sm'>
            <DropdownTrigger>
              <Button
                radius='sm'
                variant='light'
                color='default'
                className='font-medium'
              >
                Level: {selectedLevelKey}
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>
                <RadioGroup
                  defaultValue={selectedLevelKey}
                  onValueChange={setSelectedLevelKey}
                >
                  <Radio value='None'>None</Radio>
                  <Radio value='Beginner'>Beginner</Radio>
                  <Radio value='Intermediate'>Intermediate</Radio>
                  <Radio value='Advanced'>Advanced</Radio>
                </RadioGroup>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            onClick={() => {
              handleReset();
            }}
            className='Solid'
          >
            Reset all
          </Button>
        </div>
        <div className='flex flex-wrap items-start justify-center gap-4'>
          {filteredCourses.map((course) => {
            let courseSrc = course?.photo.slice(8);
            return (
              <Card
                key={course._id}
                classNames='bg-white dark:bg-neutral-800 w-[282px] border dark:border-neutral-600 shadow-lg dark:shadow-white/5'
              >
                <CardHeader>
                  <img
                    lazy='true'
                    draggable='false'
                    src={`http://localhost:8000/${courseSrc}`}
                    alt={course?.courseName}
                    className='w-full h-[177px] object-cover'
                  />
                </CardHeader>
                <CardContent classNames='p-4 flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>{course.courseName}</h3>

                  <p className='flex items-center'>
                    {course.rating} <FaStar color='yellow' />
                  </p>
                </CardContent>
                <CardFooter classNames='pb-4 flex justify-center items-center'>
                  <button
                    className='Solid'
                    onClick={() => {
                      enrollCourse(course._id);
                    }}
                  >
                    Enroll now
                  </button>
                  <button
                    className='Light'
                    onClick={() => {
                      navigate(`/courses/${course._id}`);
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
      <Footer />
    </div>
  );
}

export default CoursesPage;
