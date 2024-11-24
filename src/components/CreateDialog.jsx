import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"; // Assuming you have a dialog component
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { IoCreate } from "react-icons/io5";
import { SiYoutubeshorts } from "react-icons/si";
import { BsFileEarmarkMusicFill } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import CreatePost from "./CreatePost";
import UploadAudio from "./UploadAudio";
import CreateBlogPost from "./CreateBlogPost";

function CreateDialog({ open, setOpen }) {
  const [showFullBio, setShowFullBio] = useState(false);

  const [currentStep, setCurrentStep] = useState(1); // Step state
  const [selectedOption, setSelectedOption] = useState(null);
  const [caption, setCaption] = useState("");
  const [music, setMusic] = useState(null);
  const [collab, setCollab] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { user } = useSelector((store) => store.auth);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setCurrentStep(2); // Go to step 2 after option selection
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    // Handle submit logic based on the selected option
    console.log({
      selectedOption,
      caption,
      music,
      collab,
      audioFile,
      title,
      content,
    });
    setOpen(false); // Close the dialog after submission
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-[90%] sm:max-w-lg rounded-lg"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader className="text-center font-semibold">
          {currentStep === 1 && "What do you want to create?"}
        </DialogHeader>

        {currentStep === 1 && (
          <div>
            <div className="flex gap-3 items-start">
              <Avatar className="min-w-8 max-w-8 aspect-square rounded-full overflow-hidden">
                <AvatarImage
                  className="min-w-8 max-w-8 aspect-square rounded-full object-cover"
                  src={user?.avatar}
                  alt="@shadcn"
                />
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
                onClick={() => handleOptionClick("Post")}
              >
                <IoCreate />
                Create Post
              </button>
              <button
                className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit bg-gray-300 rounded-lg"
                onClick={() => handleOptionClick("Shorts")}
              >
                <SiYoutubeshorts />
                Create Shorts
              </button>
              <button
                className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit bg-gray-300 rounded-lg"
                onClick={() => handleOptionClick("Upload Audio")}
              >
                <BsFileEarmarkMusicFill />
                Upload Audio
              </button>
              <button
                className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit bg-gray-300 rounded-lg"
                onClick={() => handleOptionClick("Blog")}
              >
                <MdEditDocument />
                Write Blog
              </button>
              <button
                className="btn-primary hover:bg-black hover:text-white flex px-3 py-2 gap-2 flex-grow items-center justify-center w-fit bg-gray-300 rounded-lg"
                onClick={() => handleOptionClick("Story")}
              >
                <FaHistory />
                Create Story
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && selectedOption === "Post" && <CreatePost
              setCurrentStep={setCurrentStep} setOpen={setOpen}
              /> 
        }
        {currentStep === 2 && 
        selectedOption === "Upload Audio" && <UploadAudio  setCurrentStep={setCurrentStep} />
        }
        {currentStep === 2 &&  selectedOption === "Blog" && <CreateBlogPost  setCurrentStep={setCurrentStep} />}
      </DialogContent>
    </Dialog>
  );
}

export default CreateDialog;