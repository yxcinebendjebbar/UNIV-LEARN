import React from "react";
import NavBar from "../components/NavBar";

function LandingPage() {
  return (
    <div className='w-screen h-screen'>
      <NavBar />
      <main className='mx-8 mt-8 md:px-24'>
        <div>
          <p className='text-header'>Discover UNIV-LEARN:</p>
          <p className='text-desc'>
            Transformative Education Awaits! <br /> Explore dynamic courses,
            collaborative tools, and seamless administration. Join now for a
            journey of discovery and lifelong learning.
          </p>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
