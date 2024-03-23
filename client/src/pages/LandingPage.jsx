import React from "react";
import univlearn from "../assets/univ-learn-logo.png";

function LandingPage() {
  return (
    <section>
      <header className='max-h-96 w-screen flex justify-center items-center relative'>
        <img
          src='https://images.unsplash.com/photo-1488998427799-e3362cec87c3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Students studying'
          draggable='false'
          className='w-screen max-h-96 object-cover -z-50 brightness-95'
        />
        <img
          src={univlearn}
          draggable='false'
          alt='UNIVLEARN'
          className='absolute'
        />
      </header>
    </section>
  );
}

export default LandingPage;
