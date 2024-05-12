import { useState } from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth.jsx";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function SettingsPage() {
  const { user, updateUser } = useAuth();

  const [thumbnailSrc, setThumbnailSrc] = useState("");

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a new FileReader object
      reader.onload = () => {
        // Set the thumbnailSrc state with the data URL of the selected file
        setThumbnailSrc(reader.result);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const updateUserProfilePicture = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await axios.put(
        `/api/users/profile/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      updateUser(response.data.user);
      location.reload();

      alert("User updated successfully!");
    } catch (error) {
      console.error(error);

      alert("Failed to update user!");
    }
  };

  const updateUserName = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const userName = formData.get("userName");

    try {
      const res = await axios.put("/api/users/profile/name", {
        name: userName,
      });
      updateUser(res.data.user);
      location.reload();
      alert("User name updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update user name!");
    }
  };

  const updateUserEmail = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const email = formData.get("email");

    try {
      const response = await axios.put("/api/users/profile/email", {
        email: email,
      });
      updateUser(response.data.user);
      alert("User email updated successfully!");
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to update user email!");
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const prevPass = formData.get("prevPass");
    const newPass = formData.get("newPass");
    const verNewPass = formData.get("verNewPass");

    if (newPass !== verNewPass) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.put("/api/users/profile/password", {
        password: newPass,
        prevPw: prevPass,
      });

      alert(response.data.message);
      location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to update user password!");
    }
  };
  return (
    <>
      <NavBar />
      <div className='bg-gray-100/40 min-h-screen flex flex-col items-center'>
        <div className='rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-3xl bg-white dark:bg-neutral-900 min-h-screen flex flex-col items-center p-12'>
          <form
            onSubmit={updateUserProfilePicture}
            className='flex flex-col items-center gap-3 mb-4'
          >
            <img
              src={
                thumbnailSrc ||
                `http://localhost:8000/${user.profilePicture.slice(7)}`
              }
              alt='previous Profile picture'
              className='h-40 w-40 rounded-full'
            />
            <label className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'>
              Edit you profile picture
            </label>
            <input
              type='file'
              name='profilePicture'
              onChange={handleThumbnailChange}
              className='flex h-10  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />

            <Button
              type='submit'
              className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-40'
            >
              change picture
            </Button>
          </form>
          <form
            onSubmit={updateUserName}
            className='flex flex-col self-start gap-3 mb-8'
          >
            <label
              className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'
              htmlFor='name'
            >
              Edit you name
            </label>
            <input
              type='text'
              name='userName'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              id='name'
            />
            <Button
              type='submit'
              className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-40'
            >
              change name
            </Button>
          </form>
          <hr className='h-[1px] w-full bg-black' />
          <form
            onSubmit={updateUserEmail}
            className='flex flex-col self-start gap-3 mb-8 mt-8'
          >
            <label
              className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'
              htmlFor='email'
            >
              Edit your email
            </label>
            <input
              id='email'
              type='email'
              name='email'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
            <Button
              type='submit'
              className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-40'
            >
              change email
            </Button>
          </form>
          <hr className='h-[0.5px] w-full bg-black' />
          <form
            onSubmit={updateUserPassword}
            className='flex flex-col self-start gap-3 mb-8 mt-8'
          >
            <label
              className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'
              htmlFor='prevPass'
            >
              Enter your previous password
            </label>
            <input
              type='password'
              name='prevPass'
              id='prevPass'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
            <label
              className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'
              htmlFor='newPass'
            >
              Enter your new password
            </label>
            <input
              type='password'
              name='newPass'
              id='newPass'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />
            <label
              className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg'
              htmlFor='verNewPass'
            >
              Enter your new password again
            </label>
            <input
              type='password'
              name='verNewPass'
              id='verNewPass'
              className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            />

            <Button
              type='submit'
              className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-40'
            >
              change password
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SettingsPage;
