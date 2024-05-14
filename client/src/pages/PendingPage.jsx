import React from "react";
import Switcher from "../components/Switcher";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@nextui-org/react";
import { CiLogout } from "react-icons/ci";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function PendingPage() {
  const { user, logout } = useAuth();
  console.log(user.email);
  const verifyEmail = async () => {
    const res = await axios.post("/api/users/verify-email", {
      email: user.email,
    });
    if (res.data.success) {
      console.log("Email sent");
    }
  };

  return (
    <div className='flex flex-col gap-3 justify-center items-center h-screen bg-neutral-50 dark:bg-neutral-950'>
      <div className='absolute top-5 right-8'>
        <Switcher />
      </div>
      <Button
        isIconOnly
        onClick={() => {
          logout();
        }}
        color='danger'
        className='absolute top-5 left-8'
      >
        <CiLogout className='scale-150' />
      </Button>
      <img
        src='https://www.svgrepo.com/show/14478/email.svg'
        className='scale-150 animate-bounce w-10 dark:invert'
      />
      <h2 className='text-center text-xl'>
        Your account is pending, please check your email for verification, click{" "}
        <button
          className='text-primary underline'
          onClick={() => {
            verifyEmail();
          }}
        >
          here
        </button>{" "}
        to resend the verification email.
        <br />
        For further assistance, you may contact{" "}
        <a
          href='mailto:univlearn13@gmail.com'
          className='text-primary underline'
        >
          support
        </a>
        .
      </h2>
    </div>
  );
}

export default PendingPage;
