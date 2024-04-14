import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { IoMdSearch } from "react-icons/io";

const SearchBar = () => {
  return (
    <div className='flex justify-center items-center gap-3 m-4 min-w-20 lg:mx-80 lg:min-w-32 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-neutral-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 lg:my-32'>
      <IoMdSearch className='scale-150' />
      <input
        type='text'
        placeholder='Search for courses'
        className='bg-transparent w-full'
      />
      <button className='Light'>Search</button>
    </div>
  );
};

function CoursesPage() {
  return (
    <div>
      <NavBar />
      <SearchBar />
      <Footer />
    </div>
  );
}

export default CoursesPage;
