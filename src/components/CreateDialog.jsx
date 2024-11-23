import React from "react";
import { Dialog, DialogOverlay, DialogContent, DialogHeader } from "./ui/dialog"; // Assuming you have a dialog component
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";

function CreateDialog({ open, setOpen }) {
  const navigate = useNavigate();

  const {user} = useSelector(store => store.auth)
  const handleOptionClick = (path) => {
    setOpen(false);
    navigate(path); // Navigate to the specific page
  };

  console.log(open, 'open')

  return (
    <Dialog open={open} >
      <DialogContent className="max-w-[90%] sm:max-w-lg rounded-lg" onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          What do you want to create ?
        </DialogHeader>
        <div className="flex gap-3 items-center">
        <Avatar className="w-8 h-8 rounded-full overflow-hidden">
              <AvatarImage src={user?.avatar} alt="@shadcn" />
              <AvatarFallback>
                <img
                  src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                  alt="Fallback"
                />
              </AvatarFallback>
            </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>
        <div className="flex gap-1">
        <button
            className="btn-primary px-3 py-2 max-w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/create-post")}
          >
            Create Post
          </button>
          <button
            className="btn-primary px-3 py-2 max-w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/create-shorts")}
          >
            Create Shorts
          </button>
          <button
            className="btn-primary px-3 py-2 max-w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/upload-audio")}
          >
            Upload Audio
          </button>
          <button
            className="btn-primary px-3 py-2 max-w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/write-blog")}
          >
            Write Blog
          </button>
          <button
            className="btn-primary px-3 py-2 max-w-fit bg-gray-300 rounded-lg"
            onClick={() => handleOptionClick("/create-story")}
          >
            Create Story
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDialog;