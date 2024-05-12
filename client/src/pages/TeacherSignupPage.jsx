import React from "react";
import axios from "axios";
import Switcher from "../components/Switcher";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@nextui-org/react";

axios.defaults.baseURL = "http://localhost:8000";
function SignupPage() {
  const { login } = useAuth();
  const signup = async (fullName, email, password) => {
    await axios
      .post(
        "/api/users/signup",
        {
          fullName,
          email,
          passwrd: password,
          role: "teacher",
        },
        { withCredentials: true }
      )
      .then(async (res) => {
        if (res.data.user.status === "pending") {
          await axios
            .post("/api/users/verify-email", { email: email })
            .then((res) => {
              console.log("email sent");
              if (res.data.success) {
                location.href = "/pending";
              }
            });
        }
        if (res.data.auth) {
          await login({ ...res.data.user, email: email });
        }
      })
      .catch((err) => {
        const error = err.response.data.error;
        console.error(err);
        if (error.includes("E11000")) {
          confirm("Email already exists. Do you want to login?")
            ? (window.location.href = "/login-teacher")
            : (window.location.href = "/signup-teacher");
          return;
        }
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    if (
      data.get("full-name") === "" ||
      data.get("email") === "" ||
      data.get("password") === "" ||
      data.get("password-confirm") === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    if (data.get("email").match(/@univ-tlemcen.dz$/) === null) {
      alert("Please use your university email");
      return;
    }
    if (data.get("password") !== data.get("password-confirm")) {
      alert("Passwords do not match");
      return;
    } else if (
      data.get("password").length < 8 ||
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
        data.get("password")
      )
    ) {
      alert(
        "Password must contain at least 8 characters, including UPPER/lowercase and numbers"
      );
      return;
    }

    const fullName = data.get("full-name");
    const email = data.get("email");
    const password = data.get("password");

    signup(fullName, email, password);
  };
  return (
    <div className='flex flex-col items-center justify-start px-6 py-8 mx-auto h-screen lg:py-0'>
      <div className='self-end p-4'>
        <Switcher />
      </div>
      <section className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-800 dark:border-neutral-700'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
            Create Account
          </h1>
          <form
            onSubmit={handleSubmit}
            method='POST'
            className='space-y-4 md:space-y-6'
          >
            <div>
              <label
                htmlFor='full-name'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Your full name
              </label>
              <input
                type='text'
                name='full-name'
                id='full-name'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-neutral-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                placeholder='Full Name'
                required={true}
              />
            </div>
            <div>
              <label
                htmlFor='email'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Your email
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
            <div>
              <label
                htmlFor='password-confirm'
                className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
              >
                Repeat Password
              </label>
              <input
                type='password'
                name='password-confirm'
                id='password-confirm'
                placeholder='••••••••'
                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-neutral-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                required={true}
              />
            </div>

            <Button
              type='submit'
              className='w-full'
              radius='sm'
              variant='solid'
              color='primary'
            >
              Sign up
            </Button>
            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
              Already have an account?{" "}
              <a
                href='/login-teacher'
                className='font-medium text-primary-600 hover:underline dark:text-primary-500'
              >
                Log in
              </a>
            </p>
            <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
              Or sign up as{" "}
              <a
                href='/signup'
                className='font-medium text-primary-600 hover:underline dark:text-primary-500'
              >
                Student
              </a>
            </p>
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

export default SignupPage;
