import React from "react";
import axios from "axios";
import Switcher from "../components/Switcher";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@nextui-org/react";

function LoginPage() {
  const { loginAdmin } = useAuth();
  const logIn = async (email, password) => {
    await axios
      .post(
        "/api/admins/login",
        {
          email,
          passwrd: password,
        },
        { withCredentials: true }
      )
      .then(async (res) => {
        console.log(res);
        if (res.data.auth) {
          await loginAdmin(res.data.user);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Incorrect email or password");
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    if (data.get("email") === "" || data.get("password") === "") {
      alert("Please fill all the fields");
      return;
    }

    const email = data.get("email");
    const password = data.get("password");

    logIn(email, password);
  };
  return (
    <div className='flex flex-col items-center justify-start px-6 py-8 mx-auto h-screen lg:py-0'>
      <div className='self-end p-4'>
        <Switcher />
      </div>
      <section className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-800 dark:border-neutral-700'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
            Admin Panel Login
          </h1>
          <form
            onSubmit={handleSubmit}
            method='POST'
            className='space-y-4 md:space-y-6'
          >
            <div>
              <label
                htmlFor='email'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Email
              </label>
              <input
                type='email'
                name='email'
                id='email'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-neutral-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='name@univ-tlemcen.dz'
                required={true}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-neutral-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                required={true}
              />
            </div>

            <Button
              type='submit'
              className='w-full'
              variant='solid'
              radius='sm'
              color='primary'
            >
              Log in
            </Button>
          </form>
        </div>
      </section>
      <p className='text-center my-4 text-neutral-900/75 dark:text-neutral-100/75 text-sm'>
        © 2024 by UNIVLEARN. All rights reserved. <br />
        Designed with ❤️ by UNIVLEARN Team
      </p>
    </div>
  );
}

export default LoginPage;
