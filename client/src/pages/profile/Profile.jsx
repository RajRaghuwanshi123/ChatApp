import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoArrowBack } from "react-icons/io5";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { SAVE_CHANGES } from "@/utils/constants";
import { toast } from "sonner";
export default function Profile() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectColor, setSelectColor] = useState(1);
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const navigateTo = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("You have to setup profile first");
    }
  };
  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };
  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          SAVE_CHANGES,
          {
            firstName,
            lastName,
            color: selectColor,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status == 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={navigateTo}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center "
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src="{image}"
                  alt="profile"
                  className="object_cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl flex items-center justify-center ${getColor(
                    selectColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full ring-fuchsia-50">
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
          </div>
          <div>
            <div className="flex min-w-32 md:min-w:64 flex-col gap-5 text-white items-center justify-center">
              <div className="w-full">
                <Input
                  placeholder="Email"
                  type="email"
                  disbaled
                  value={userInfo.email}
                  className="rounded-lg p-6 m-2  bg-[#2c2e3b] border-none"
                />
                <div className="w-full">
                  <Input
                    placeholder="First Name"
                    type="text"
                    onChange={(e) => setfirstName(e.target.value)}
                    value={userInfo.firstName}
                    className="rounded-lg p-6 m-2 bg-[#2c2e3b] border-none"
                  />
                </div>
                <div className="w-full">
                  <Input
                    placeholder="Last Name"
                    type="text"
                    onChange={(e) => setlastName(e.target.value)}
                    value={userInfo.lastName}
                    className="rounded-lg p-6 m-2 bg-[#2c2e3b] border-none"
                  />
                </div>
                <div className="w-full flex gap-5 p-3">
                  {colors.map((color, index) => (
                    <div
                      className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                        selectColor === index ? "outline outline-white/50 " : ""
                      }`}
                      key={index}
                      onClick={() => setSelectColor(index)}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full m-4">
              <Button
                className=" h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                onClick={saveChanges}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
