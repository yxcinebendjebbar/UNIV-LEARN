import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";

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
    <div className='w-screen h-screen'>
      <NavBar />
      <main className='mx-8 mt-8 md:px-24 '>
        <div className='text-center md:text-left flex flex-col items-center gap-2 md:items-start'>
          <p className='text-header'>Discover UNIV-LEARN:</p>
          <p className='text-desc'>
            Transformative Education Awaits! <br /> Explore dynamic courses,
            collaborative tools, and seamless administration. Join now for a
            journey of discovery and lifelong learning.
          </p>
          <div className='flex gap-3'>
            <button
              className='Solid'
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Join now
            </button>
            <button
              className='Bordered'
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Continue learning
            </button>
          </div>
        </div>
      </main>
      <section className='m-8 md:px-24'>
        <h2 className='text-header'>Categories</h2>
        <p className='text-subheader'>
          Such variation of topics and categories
        </p>
        <div className='flex flex-wrap items-center justify-center gap-8 mt-8'>
          {categories.map((category) => (
            <div
              key={category}
              className='w-56 h-72  flex flex-col justify-center items-center rounded shadow-md shadow-black brightness-75 hover:cursor-pointer hover:brightness-100 transition-all'
            >
              <img
                src={category.image}
                alt={category.title}
                className='w-56 h-64 object-cover -z-40  rounded'
              />
              <p className='text-center  font-bold text-neutral-900 dark:text-neutral-100'>
                {category.title}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className='m-8 md:px-24'>
        <h2 className='text-header'>Are you a Student or a Teacher?</h2>
        <p className='text-subheader'>Accounts types</p>
        <div className='flex gap-8 flex-wrap items-center justify-center my-8'>
          <AnimatePresence>
            <div className='w-64 h-64 bg-gray-100 rounded-lg shadow-md overflow-hidden'>
              <motion.div
                className='p-4 flex flex-col justify-between h-full'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <h2 className='text-lg font-semibold'>Course Title</h2>
                  <img
                    src='https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?q=80&w=1588&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    alt='Course Image'
                    className='mt-2 rounded-md'
                  />
                </div>
                <motion.div
                  className='hidden group-hover:block'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className='text-gray-600 mt-2'>Course Description</p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className='bg-blue-500 text-white rounded-md px-4 py-2 mt-4 block w-full text-center'
                  >
                    Register
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
