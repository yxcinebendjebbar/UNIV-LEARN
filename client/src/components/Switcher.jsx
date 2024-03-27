import { useState, useEffect } from "react";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";

function Switcher() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  }, [darkMode]);

  return (
    <div>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <CiLight width={32} /> : <CiDark width={32} />}
      </button>
    </div>
  );
}

export default Switcher;
