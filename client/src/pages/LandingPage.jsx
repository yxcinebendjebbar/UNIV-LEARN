import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar.jsx";
import Accordion from "../components/Accordion";
import studying from "../assets/studying-header.png";
import studentImg from "../assets/student.jpg";
import teacherImg from "../assets/teacher.jpg";
import Footer from "../components/Footer";

const categories = [
  {
    title: "Software Engineering",
    image:
      "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?q=80&w=1552&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Mathematics",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Medicine",
    image:
      "https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Physics",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

function LandingPage() {
  return (
    <div className="w-screen">
      <NavBar />
      <main className="mx-8 md:px-24 mt-32 mb-52">
        <div className="flex items-center justify-between">
          <div className="text-center md:text-left flex flex-col items-center gap-2 md:items-start">
            <p className="text-header mb-4">Discover UNIV-LEARN:</p>
            <p className="text-desc mb-4">
              Transformative Education Awaits! Explore dynamic courses,
              collaborative tools, and seamless administration. Join now for a
              journey of discovery and lifelong learning.
            </p>
            <div className="flex gap-3">
              <button
                className="Solid md:h-20 md:w-44 md:font-bold"
                onClick={() => {
                  window.location.href = "/signup";
                }}
              >
                Join now
              </button>
              <button
                className="Bordered md:w-64 md:font-bold"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Continue learning
              </button>
            </div>
          </div>
          <img src={studying} alt="Studying" className="hidden lg:block" />
        </div>
      </main>
      <section className="m-8 md:px-24">
        <h2 className="text-header">Categories</h2>
        <p className="text-subheader mb-4">
          Such variation of topics and categories
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
          <AnimatePresence>
            {categories.map((category, i) => (
              <motion.div
                key={i}
                className="w-56 h-72  flex flex-col justify-center items-center rounded shadow-lg hover:cursor-pointer dark:shadow-white/5"
                whileHover={{ scale: 1.02, brightness: 100 }}
                onClick={() => {
                  window.location.href = "/courses";
                }}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-56 h-64 object-cover self-start  rounded"
                />
                <p className="text-center  font-bold text-neutral-900 dark:text-neutral-100">
                  {category.title}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
      <section className="mx-8 md:px-24 mt-32 pb-8">
        <h2 className="text-header">Accounts types</h2>
        <p className="text-subheader mb-4">Are you a Student or a Teacher?</p>
        <div className="flex gap-8 md:gap-20 flex-wrap items-center justify-center my-8">
          <AnimatePresence>
            <div className="rounded hover:cursor-pointer shadow-md shadow-black/10 dark:shadow-white/10 w-72 h-[432px]">
              <motion.div
                className="relative flex justify-center items-center w-72 h-[432px]"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  window.location.href = "/signup";
                }}
              >
                <img
                  src={studentImg}
                  alt="Student"
                  className="h-full w-full object-cover rounded *:brightness-75"
                />
                <motion.p
                  className="text-center font-bold text-neutral-100 absolute text-3xl w-full h-full flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Student
                </motion.p>
              </motion.div>
            </div>
            <div className="rounded hover:cursor-pointer shadow-md shadow-black/10 dark:shadow-white/10 w-72 h-[432px]">
              <motion.div
                className="relative flex justify-center items-center w-72 h-[432px]"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  window.location.href = "/signup-teacher";
                }}
              >
                <img
                  src={teacherImg}
                  alt="Student"
                  className="h-full w-full object-cover rounded brightness-75 transition-all"
                />
                <motion.p
                  className="text-center font-bold text-neutral-100 absolute text-3xl w-full h-full flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Teacher
                </motion.p>
              </motion.div>
            </div>
          </AnimatePresence>
        </div>
      </section>
      <section className="mx-8 md:px-24 mt-32 pb-8 flex flex-col items-center lg:items-start lg:flex-row lg:justify-between gap-x-5">
        <div className="lg:max-w-60">
          <h2 className="text-header"> FAQ</h2>
          <p className="text-subheader">
            Still having any questions? Contact our team via
            support.univlearn@gmail.com
          </p>
          <button className="Light font-medium">See All FAQs</button>
        </div>
        <div className="mt-8 w-2/3 flex flex-col gap-16">
          <Accordion
            title="Can i enroll in multiple classes at once?"
            defaultState="opened"
          >
            Absolutely! You can enroll in multiple courses simultaneously and
            access them at your convenience.
          </Accordion>
          <Accordion
            title="What kind of support can I expect from instructors?"
            defaultState="closed"
          >
            Our instructors are available to answer your questions and provide
            feedback on your assignments and projects.
          </Accordion>
          <Accordion
            title="Are the courses self-paced or do they have specific start and end dates?"
            defaultState="closed"
          >
            Our courses are self-paced, so you can start and finish them at your
            convenience.
          </Accordion>
          <Accordion
            title="Are there any prerequisites for the courses?"
            defaultState="closed"
          >
            Some courses may have prerequisites, but most of them are open to
            anyone interested in learning.
          </Accordion>
          <Accordion
            title="Can I download the course materials for offline access?"
            defaultState="closed"
          >
            Yes, you can download the course materials and access them offline
            at any time.
          </Accordion>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
