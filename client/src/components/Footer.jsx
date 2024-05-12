import React from "react";
import univLearnLogo from "../assets/univ-learn-logo-black.png";
import { CiMail, CiPhone, CiLocationOn } from "react-icons/ci";

function Footer() {
  return (
    <footer className='p-8 border-t flex flex-col gap-4'>
      <div className='flex justify-evenly items-start mb-4'>
        <div>
          <div className='flex items-center gap-2 mb-4'>
            <img
              src={univLearnLogo}
              alt='Univ learn'
              className='w-8 dark:invert'
            />
            <h2 className='text-3xl font-bold'>UNIVLEARN</h2>
          </div>
          <div className='hidden lg:flex flex-col gap-3 font-medium'>
            <div className='flex items-center gap-2'>
              <CiMail className='scale-150' /> <p>univlearn13@gmail.com</p>
            </div>
            <div className='flex items-center gap-2'>
              <CiPhone className='scale-150' /> <p>+213 779 52 78 89</p>
            </div>
            <div className='flex items-center gap-2'>
              <CiLocationOn className='scale-150' />
              <p>University of Tlemcen, Tlemcen, Algeria</p>
            </div>
          </div>
        </div>
        <div className='hidden lg:block'>
          <h2 className='text-xl font-bold'>Quick Links</h2>
          <div className='flex flex-col gap-2 font-medium'>
            <a href='/home'>Home</a>
            <a href='/courses'>Courses</a>
            <a href='/forums'>Forums</a>
          </div>
        </div>
      </div>
      <p className='text-center text-neutral-900/75 dark:text-neutral-100/75 text-sm'>
        © 2024 by UNIVLEARN. All rights reserved. <br />
        Designed with ❤️ by UNIVLEARN Team
      </p>
    </footer>
  );
}

export default Footer;
