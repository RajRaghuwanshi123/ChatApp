import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lottie from "react-lottie";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACT } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar } from "@radix-ui/react-avatar";
export default function NewDm() {
  const [searchedContact, setsearchedContact] = useState([]);
  const [openNewContactModel, setopenNewContactModel] = useState();
  const searchContacts = async (seatchTerm) => {
    try {
      if (seatchTerm > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACT,
          { seatchTerm },
          { withCredentials: true }
        );
        console.log(response);
        if (response.status === 200 && response.data.contacts) {
          setsearchedContact(response.data.contacts);
        }
      } else {
        setsearchedContact([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300 "
              onClick={() => setopenNewContactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModel} onOpenChange={setopenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contact"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div className="flex  flex-col gap-5">
              {searchedContact.map((contact) => (
                <div
                  key={contact.id}
                  className="flex gap-3 items-center cursor-pointer"
                >
                  <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                      {
                        // userInfo.image ? (
                        //   <AvatarImage
                        //     src={`${HOST}${userInfo.image}`}
                        //     alt="profile"
                        //     className="object_cover w-full h-full bg-black"
                        //   />
                        // ) : (
                        <div
                          className={`uppercase h-12 w-12 text-lg flex items-center justify-center ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                        //)
                      }
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : ""}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchedContact.length <= 0 && (
            <div className="flex-1 md:bg-[#1c1d25] md:flex mt-5 flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div
                className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5
            lg:text-2xl text-xl transition-all duration-300 text-center"
              >
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">!</span>
                  Search new
                  <span className="text-purple-500"> Contact. </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
