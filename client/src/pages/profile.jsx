import profilePic from "../assets/profile.png";
import coursePic from "../assets/thumbnail.png";
import NavBar from "../components/Navbar.jsx";
import Footer from "../components/Footer";
const courses = [
  {
    thumbnail: coursePic,
    title: "javascript",
    progres: 50,
  },
  {
    thumbnail: coursePic,
    title: "html & css",
    progres: 20,
  },
  {
    thumbnail: coursePic,
    title: "react",
    progres: 100,
  },
  {
    thumbnail: coursePic,
    title: "vue",
    progres: 10,
  },
];
const profile = {
  img: profilePic,
  name: "yacine benmansour",
  status: "student",
};
export const Profile = () => {
  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center mb-20">
        <img
          src={profile.img}
          alt="profile picture"
          className="h-48 w-48 mt-12"
        />
        <p className="text-3xl font-semibold mt-4">{profile.name}</p>
        {/* student or teacher */}
        <p className="text-xl">{profile.status}</p>
        <div className="flex flex-col">
          <div className="flex items-center mb-6">
            <p>My courses</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={20}
              fill="currentColor"
              height={20}
            >
              <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
            </svg>
          </div>
          {!courses.length ? (
            <p>enroll a course</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {courses.map((course) => {
                console.log(course);
                return (
                  <div key={course.title}>
                    <img src={course.thumbnail} alt="course thumbnail" />
                    <p className="text-xl mt-2">{course.title}</p>
                    <div className="flex justify-between items-center">
                      <div className="h-[15px] w-[350px] rounded-full bg-[#d9d9d9]">
                        <div
                          className={`h-[15px] bg-[#5D61D0] rounded-full`}
                          style={{ width: `${course.progres}%` }}
                        ></div>
                      </div>
                      <p>{course.progres}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
