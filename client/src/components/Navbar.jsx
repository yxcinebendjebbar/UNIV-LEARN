import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CiMenuFries } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import Switcher from "./Switcher";
import univlearn from "../assets/univ-learn-logo-black.png";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button, Spacer } from "@nextui-org/react";

function NavBar() {
  const { user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  console.log(user);

  const { logout } = useAuth();

  const location = useLocation();

  return (
    <nav className='h-16 flex items-center justify-between border-b border-neutral-800'>
      <div className='p-4 flex items-center gap-2'>
        <img
          src={univlearn}
          alt='UnivLearn'
          width={32}
          className='dark:invert'
        />
        <h1 className='text-2xl font-bold hidden sm:block md:text-3xl lg:text-4xl'>
          UNIVLEARN
        </h1>
      </div>
      {location.pathname === "/" && (
        <ul className='flex items-center gap-2 mr-4'>
          <li>
            <button
              className='Solid '
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login
            </button>
          </li>
          <li>
            <button
              className='Bordered'
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Sign up
            </button>
          </li>
          <li className='mx-3'>
            <Switcher />
          </li>
        </ul>
      )}
      {location.pathname !== "/" && (
        <div className='flex justify-center items-center gap-8 pr-4'>
          <div className='hidden lg:block'>
            <ul className='flex items-center gap-4 text-lg font-medium'>
              <li>
                <a href='/home'>Home</a>
              </li>
              {user.role === "teacher" && (
                <li>
                  <a href='/dashboard'>Dashboard</a>
                </li>
              )}
              <li>
                <a href='/courses'>Courses</a>
              </li>
              <li>
                <a href='/forums'>Forums</a>
              </li>
              <li>
                <div>
                  <Avatar
                    src={`http://localhost:8000/${user?.profilePicture.slice(
                      7
                    )}`}
                    className=' cursor-pointer'
                    draggable='false'
                    onClick={toggleProfileMenu}
                  />
                </div>
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -100, opacity: 0 }}
                      className='absolute right-0 top-16 origin-top bg-neutral-50 border rounded dark:bg-neutral-900'
                    >
                      <ul className='flex flex-col items-start gap-4 p-4 text-base font-normal'>
                        <li>
                          <a href='/profile'>View Profile</a>
                        </li>
                        <li>
                          <a href='/settings'>Settings</a>
                        </li>
                        <li>
                          <Button
                            variant='light'
                            radius='sm'
                            color='danger'
                            onClick={() => {
                              logout();
                            }}
                          >
                            Log out
                          </Button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>
          <Switcher />
          <CiMenuFries
            className='scale-150 cursor-pointer lg:hidden'
            onClick={toggleMenu}
          />
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className='w-full fixed right-0 top-0 origin-top-right h-screen z-50 bg-neutral-100 dark:bg-neutral-900'
              >
                <div className='flex justify-end p-4'>
                  <IoClose
                    className='scale-150 cursor-pointer'
                    onClick={toggleMenu}
                  />
                </div>
                <ul className='flex flex-col items-start px-4 gap-4'>
                  <li className='flex gap-3 items-center border-b w-full pb-4'>
                    <Avatar
                      size='lg'
                      src={`http://localhost:8000/${user?.profilePicture.slice(
                        7
                      )}`}
                      draggable='false'
                    />
                    <div>
                      <h2 className='text-header'>{user?.username}</h2>
                      <a href='/profile'>View Profile</a>
                    </div>
                  </li>
                  <li>
                    <a href='/home'>Home</a>
                  </li>
                  {user.role === "teacher" && (
                    <li>
                      <a href='/dashboard'>Dashboard</a>
                    </li>
                  )}
                  <li>
                    <a href='/courses'>Courses</a>
                  </li>
                  <li>
                    <a href='/learning-paths'>Forums</a>
                  </li>
                  <li>
                    <a href='/settings'>Settings</a>
                  </li>
                  <li>
                    <button
                      className='text-red-500 hover:underline'
                      onClick={() => {
                        logout();
                      }}
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
