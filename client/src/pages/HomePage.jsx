import React from "react";
import NavBar from "../components/NavBar";

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <NavBar />
      HomePage
    </div>
  );
}

export default HomePage;
