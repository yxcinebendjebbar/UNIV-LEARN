import { useState } from "react";
import axios from "axios";
import Switcher from "../components/Switcher";
import { Button } from "@nextui-org/react";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000/";

function ForgotPassword() {
  const [email, setEmail] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    setEmail(formData.get("email"));
    try {
      const response = await axios.post("/api/users/forgotpass", { email });
      if (response.data.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0'>
      <div className='self-end absolute top-0 p-4'>
        <Switcher />
      </div>
      <section className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-neutral-800 dark:border-neutral-700'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
            Forgot password?
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

            <Button
              type='submit'
              className='w-full'
              variant='solid'
              radius='sm'
              color='primary'
            >
              Reset Password
            </Button>
            {isSubmitted && (
              <p className='text-success'>
                If the email exists, you will receive an email with instructions
                to reset your password.&nbsp;
              </p>
            )}
          </form>
        </div>
      </section>
      <p className='text-center my-4 text-neutral-900/75 dark:text-neutral-100/75 text-sm absolute bottom-0'>
        © 2024 by UNIVLEARN. All rights reserved. <br />
        Designed with ❤️ by UNIVLEARN Team
      </p>
    </div>
  );
}

export default ForgotPassword;
