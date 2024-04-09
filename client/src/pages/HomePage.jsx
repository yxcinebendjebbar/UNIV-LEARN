import React from "react";
import NavBar from "../components/NavBar";

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <NavBar />
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold flex items-center'>
          Welcome {user.username}
        </h1>
        <p className='mt-4 text-lg'>You are logged in as {user.role}</p>
      </div>
    </div>
  );
}

export default HomePage;
