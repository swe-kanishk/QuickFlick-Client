import React, { useState } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
} from "./ui/dialog"; // Assuming you have a dialog component
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { IoCreate } from "react-icons/io5";
import { SiYoutubeshorts } from "react-icons/si";
import { BsFileEarmarkMusicFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";

function CreateDialog({ open, setOpen }) {
  const navigate = useNavigate();
  const [showFullBio, setShowFullBio] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const handleOptionClick = (path) => {
    setOpen(false);
    navigate(path); // Navigate to the specific page
  };
  const toggleBioView = () => {
    setShowFullBio((prev) => !prev);
  };
  console.log(open, "open");

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-[90%] sm:max-w-lg rounded-lg"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader className="text-center font-semibold">
          What do you want to create ?
        </DialogHeader>
        <div className="flex gap-3 items-start">
          <Avatar className="min-w-8 max-w-8 aspect-square rounded-full overflow-hidden">
            <AvatarImage className="min-w-8 max-w-8 aspect-square rounded-full object-cover" src={user?.avatar} alt="@shadcn" />
            <AvatarFallback>
              <img
                src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                alt="Fallback"
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <div className="relative">
              <p
                className={`text-gray-600 inline-block text-xs cursor-pointer ${
                  showFullBio ? "" : "truncate max-w-[250px]"
                }`}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: showFullBio ? "normal" : "nowrap",
                }}
              >
                {user?.bio || "Bio here..."}

              </p>
              {user?.bio?.length > 50 && (
                <button
                onClick={toggleBioView}
                  className="text-blue-500 text-[12px] relative bottom-1"
                >
                  {showFullBio ? "See less" : "See more"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/create-post")}
          >
            <IoCreate />
            Create Post
          </button>
          <button
            className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/create-shorts")}
          >
            <SiYoutubeshorts />
            Create Shorts
          </button>
          <button
            className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/upload-audio")}
          >
            <BsFileEarmarkMusicFill />
            Upload Audio
          </button>
          <button
            className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/write-blog")}
          >
            <MdEditDocument />
            Write Blog
          </button>
          <button
            className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/create-story")}
          >
            <FaHistory />
            Create Story
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDialog;
