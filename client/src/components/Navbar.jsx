import React from "react";
import { useLocation } from "react-router-dom";
import Switcher from "./Switcher";
import univlearn from "../assets/univ-learn-logo-black.png";

function NavBar() {
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
    </nav>
  );
}

export default NavBar;
