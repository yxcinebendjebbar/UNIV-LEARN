import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Switcher from "../components/Switcher";
import { CiUser } from "react-icons/ci";
import { FaBook } from "react-icons/fa6";
import { GoReport } from "react-icons/go";

function Sidebar() {
  const { user, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  return (
    <div className='bg-white h-screen w-14 items-center md:w-1/4 p-2 dark:bg-neutral-800 flex flex-col md:items-start justify-between'>
      <Dropdown className='block md:hidden'>
        <DropdownTrigger>
          <Avatar
            src={user?.photoURL}
            alt='avatar'
            size='large'
            className='cursor-pointer block md:hidden'
          />
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownSection>
            <DropdownItem
              icon={<CiUser />}
              onClick={() => navigate("/ap/users")}
            >
              Users
            </DropdownItem>
            <DropdownItem
              icon={<FaBook />}
              onClick={() => navigate("/ap/courses")}
            >
              Courses
            </DropdownItem>
            <DropdownItem
              icon={<GoReport />}
              onClick={() => {
                navigate("/ap/requests");
              }}
            >
              Teacher Requests
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              color='danger'
              onClick={() => {
                logoutAdmin();
              }}
            >
              Logout
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <div className=' items-center gap-1 hidden md:flex'>
        <Avatar name={user?.username} size='lg' />
        <div className='hidden md:block'>
          <h2 className='text-lg'>{user?.username}</h2>
        </div>
      </div>
      <div className='font-medium text-lg  flex-col gap-4 cursor-pointer hidden md:flex'>
        <p
          onClick={() => {
            navigate("/ap/users");
          }}
          className='flex items-center gap-2 p-2 w-full rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800'
        >
          <CiUser className='scale-150' />
          Users
        </p>
        <p
          onClick={() => {
            navigate("/ap/courses");
          }}
          className='flex items-center gap-2 p-2 w-full rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800'
        >
          <FaBook className='scale-150' />
          Courses
        </p>
        <p
          onClick={() => {
            navigate("/ap/requests");
          }}
          className='flex items-center gap-2 p-2 w-full rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800'
        >
          <GoReport className='scale-150' />
          Teacher Requests
        </p>
      </div>
      <div className='space-y-4'>
        <Button
          variant='light'
          color='danger'
          className='hidden md:block'
          onClick={() => {
            logoutAdmin();
          }}
        >
          Logout
        </Button>
        <Switcher />
      </div>
    </div>
  );
}

export default Sidebar;
