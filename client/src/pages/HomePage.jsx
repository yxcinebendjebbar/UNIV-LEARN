import HomeNavBar from "../components/Navbar.jsx";

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <HomeNavBar />
      HomePage
    </div>
  );
}

export default HomePage;
