import { useState, useEffect } from "react";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";

function Switcher() {
  const [darkMode, setDarkMode] = useState(false);
  const dark = localStorage.getItem("darkMode");

  useEffect(() => {
    if (dark === "true") {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  }, [darkMode]);

  console.log(dark, darkMode);

  return (
    <div>
      <button
        onClick={() => {
          setDarkMode(!darkMode);
          localStorage.setItem("darkMode", !darkMode);
        }}
      >
        {darkMode ? (
          <CiLight className='scale-150' />
        ) : (
          <CiDark className='scale-150' />
        )}
      </button>
    </div>
  );
}

export default Switcher;
