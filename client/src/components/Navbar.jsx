import React from "react";
import univlearn from "../assets/univ-learn-logo-black.png";

function Navbar() {
  return (
    <nav className='flex justify-between shadow-neutral-600 shadow-md z-[9999px]'>
      <div className='flex justify-center items-center'>
        <img
          src={univlearn}
          draggable='false'
          alt='UNIVLEARN logo'
          className='w-8 m-2 ml-10'
        />
        <h1 className='text-5xl m-2 font-bold pb-2'>UNIVLEARN</h1>
      </div>
      <ul className='flex gap-3 justify-evenly items-center mx-3'>
        <li>
          <button className='text-btn'>Sign in as Teacher</button>
        </li>
        <li>
          <button className='primary-btn'>Login</button>
        </li>
        <li>
          <button className='secondary-btn'>Sign up</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
