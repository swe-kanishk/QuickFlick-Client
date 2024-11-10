import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { readFileAsDataURL } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import ViewStory from "./ViewStory";

function CreateStories() {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const imageRef = useRef();
  const [open, setOpen] = useState(false);
  const [viewStory, setViewStory] = useState(false)
  const[dark, setDark] = useState(true)

  const handleCreateStories = async () => {
    const formData = new FormData();

    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      const response = await axios.post(`http://localhost:3000/api/v1/stories`, formData, {withCredentials: true, headers: { 'Content-Type': 'multipart/form-data',}});
      if(response.data.success) {
        toast.success(response.data.message)
      }
    } catch (error) {
        console.log(error)
    }
    finally {
        setLoading(false);
        setOpen(false)
    }
  };

  const fileChangeHandler = async (e) => {
    console.log("file chanbge chaalka");
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataURL = await readFileAsDataURL(file);
      setImagePreview(dataURL);
    }
  };
  return (
    <>
    <div className="flex flex-col items-center gap-[5px]">
      <div
        onClick={() => setViewStory(true)}
        className={`w-14 h-14 ${user?.stories ? 'bg-gradient-to-tr' : ''} ${
          loading
            ? "from-gray-400 animate-spin to-gray-200"
            : "from-orange-700 via-pink-500 to-yellow-400"
        }  cursor-pointer flex items-center justify-center rounded-full`}
      >
        <div className="h-12 w-12 relative cursor-pointer rounded-full">
          <FaPlus
            onClick={() => setOpen(true)}
            className="bottom-1 bg-[#151515] text-white rounded-full p-1 w-12 h-12 text-lg right-1"
          />
        </div>
      </div>
      <div className={`flex flex-col text-[12px] items-center gap-[5px] ${dark ? 'text-white' : 'text-black'}`}><span>you</span></div>
      </div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader className="text-center font-semibold">
            Add New Story
          </DialogHeader>
          <div className="flex gap-3 items-center">
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
            <div className="w-full h-64 flex items-center justify-center">
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
            className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
          >
            Select from computer
          </Button>
          {imagePreview &&
            (loading ? (
              <Button>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                onClick={handleCreateStories}
                type="submit"
                className="w-full"
              >
                Post
              </Button>
            ))}
        </DialogContent>
      </Dialog>
      {
      viewStory ? (
      <ViewStory user={user._id} setViewStory={setViewStory} />
      ) : ""
      }
    </>
  );
}

export default CreateStories;
