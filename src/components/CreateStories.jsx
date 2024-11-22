import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { IoCreate } from "react-icons/io5";
import axios from "axios";
import { readFileAsDataURL } from "@/lib/utils";
import ViewStory from "./ViewStory";

function CreateStories() {
  const { user, isDark } = useSelector((store) => store.auth);

  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [openCreateStory, setOpenCreateStory] = useState(false);
  const [viewStory, setViewStory] = useState(false);
  const [storyActionDialog, setStoryActionDialog] = useState(false);

  const imageRef = useRef();

  const handleCreateStories = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/stories`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        // Reset fields after successful story creation
        setFile("");
        setCaption("");
        setImagePreview("");
        setOpenCreateStory(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataURL = await readFileAsDataURL(file);
      setImagePreview(dataURL);
    }
  };

  const handleProfileClick = () => {
    if (user?.stories?.length) {
      setStoryActionDialog(true);
    } else {
      setOpenCreateStory(true);
    }
  };

  return (
    <>
      <div
        onClick={handleProfileClick}
        className="flex flex-col items-center gap-2"
      >
        <div
          className={`relative w-16 h-16 rounded-full cursor-pointer flex items-center justify-center ${
            user?.stories?.length
              ? "animate-spin-slow border-4 border-transparent bg-gradient-to-tr from-orange-500 via-pink-500 to-yellow-500"
              : ""
          }`}
          style={{
            background: user?.stories?.length
              ? ""
              : isDark
              ? "#151515"
              : "#ffff",
          }}
        >
          <div className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-gray-300"></div>
          {user?.stories?.length ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaPlus className={` h-12 w-12 ${isDark ? 'text-white' : 'text-black'}`} />
          )}
        </div>
        <span
          className={`text-xs ${isDark ? "text-white" : "text-black"}`}
        >
          You
        </span>
      </div>

      {/* Dialog for story action */}
      <Dialog open={storyActionDialog} onOpenChange={setStoryActionDialog}>
        <DialogContent className="max-w-xs rounded-lg text-center">
          <DialogHeader>What would you like to do?</DialogHeader>
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => {
                setViewStory(true);
                setStoryActionDialog(false);
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              View Stories
            </Button>
            <Button
              onClick={() => {
                setOpenCreateStory(true);
                setStoryActionDialog(false);
              }}
              className="bg-green-500 hover:bg-green-600"
            >
              Create New Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for creating a story */}
      <Dialog open={openCreateStory} onOpenChange={setOpenCreateStory}>
        <DialogContent className="max-w-[90%] sm:max-w-lg rounded-lg">
          <DialogHeader className="text-center font-semibold">
            Add New Story
          </DialogHeader>
          <div className="flex gap-3 items-center mb-3">
            <Avatar>
              <AvatarImage src={user?.avatar} alt="img" />
              <AvatarFallback>
                <img
                  src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                  alt=""
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xs">{user?.username}</h1>
              <span className="text-gray-600 text-xs">Bio here...</span>
            </div>
          </div>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="focus-visible:ring-transparent border-none"
            placeholder="Write a caption..."
          />
          {imagePreview && (
            <div className="w-full h-64 flex items-center justify-center my-3">
              <img
                src={imagePreview}
                alt="preview_img"
                className="object-cover h-full w-full rounded-md"
              />
            </div>
          )}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileChangeHandler}
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
          >
            Select from computer
          </Button>
          {imagePreview && (
            <Button
              onClick={handleCreateStories}
              type="submit"
              className="w-full mt-3"
            >
              Post
            </Button>
          )}
        </DialogContent>
      </Dialog>

      {/* View Story Component */}
      {viewStory && <ViewStory user={user} setViewStory={setViewStory} />}
    </>
  );
}

export default CreateStories;
