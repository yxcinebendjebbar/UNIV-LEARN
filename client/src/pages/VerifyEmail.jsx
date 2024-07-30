import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Switcher from "../components/Switcher";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";

axios.defaults.baseURL = "https://univ-learn.onrender.com";
axios.defaults.withCredentials = true;

function VerifyEmail() {
  const { id } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const activateAccount = async () => {
    try {
      const res = await axios.post(`/api/users/activate-account/${id}`);
      if (res.data.success) {
        console.log("Account activated");
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="absolute top-5 right-8">
        <Switcher />
      </div>
      <Card className="p-4">
        <CardHeader className="text-xl font-medium">
          Email Verification
        </CardHeader>
        <CardBody>
          <p>Thank you for signing up in UNIV-LEARN.</p>
          <p>You can proceed email verification here!</p>
        </CardBody>
        <CardFooter className="flex flex-col gap-4">
          <Button
            color="primary"
            radius="sm"
            className="w-full"
            onClick={() => {
              activateAccount();
              setTimeout(() => {
                window.location.href = "/login";
              }, 1000);
            }}
          >
            Verify Email
          </Button>
          {isSubmitted && (
            <p className="text-success">Thank you for confirming your email!</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default VerifyEmail;
