import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client.js";
import { SIGNIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

export default function Auth() {
  const { setUserInfo } = useAppStore();

  const [email, setemail] = useState("");
  const [emails, setemails] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const navigate = useNavigate();
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateSignup = () => {
    if (email.length == 0) {
      toast.error("Email is required");
      return false;
    } else if (password.length == 0) {
      toast.error("Password is required");
      return false;
    } else if (confirmPassword.length == 0) {
      toast.error("Confirm Password is required");
      return false;
    } else if (password != confirmPassword) {
      toast.error("Password and confirm password should be same");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (email.length == 0) {
      toast.error("Email is required");
      return false;
    }
    if (password.length == 0) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    try {
      if (validateEmail(email) == false) {
        toast.error("Please enter valid email!!! ");
      } else {
        if (validateLogin()) {
          const response = await apiClient.post(
            SIGNIN_ROUTE,
            {
              email,
              password,
            },
            { withCredentials: true }
          );
          if (response?.request?.status === 200) {
            toast.success("Login successfull!!! ");
          }
          console.log(response);

          if (response.data.user.id) {
            setUserInfo(response.data.user);
            if (response.data.user.profileSetup) {
              navigate("/Chat");
            } else {
              navigate("/Profile");
            }
          }
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };
  const handleSignup = async () => {
    try {
      if (validateEmail(email) == false) {
        toast.error("Please enter valid email!!! ");
      } else {
        if (validateSignup()) {
          const response = await apiClient.post(
            SIGNUP_ROUTE,
            {
              email,
              password,
            },
            { withCredentials: true }
          );
          if (response?.request?.status === 200) {
            toast.success("User Signup successfully!!! ");
          }
          console.log(response)
          if (response.request.status == 200) {
            setUserInfo(response.data.user);
            navigate("/Profile");
          }
        }
      }
    } catch (err) {
      console.log(err, "errrrrrrrrr");
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className=" h-[100vh] w-[100vw] flex item-center justify-center ">
      <div
        className="h-[80vh] bg-white border-2 border-white 
      text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw]
       rounded-3xl grid xl:grid-cols-2"
      >
        <div className="flex flex-col gap-10 item-center justify-center">
          <div className="flex item-center justify-center flex-col">
            <div className="flex item-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex item-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />

                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className=" hidden xl:flex justify-center items-center">
          <img className="h=[700px]" src={Background} alt="Background image" />
        </div>
      </div>
    </div>
  );
}
