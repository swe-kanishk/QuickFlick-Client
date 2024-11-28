import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

function CreatePost({ setCurrentStep, currentStep }) {
  const [files, setFiles] = useState([]); // For images
  const [imagePreviews, setImagePreviews] = useState([]);
  const [audio, setAudio] = useState(null); // For audio
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const imageRef = useRef();
  const audioRef = useRef();

  // Handle image file changes
  const fileChangeHandler = async (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles(newFiles);

      // Generate preview URLs for images
      const previews = await Promise.all(
        newFiles.map((file) => readFileAsDataURL(file))
      );
      setImagePreviews(previews);
    }
  };

  // Handle audio file change
  const audioChangeHandler = (e) => {
    const selectedAudio = e.target.files[0];
    if (selectedAudio) {
      setAudio(selectedAudio);
      console.log(selectedAudio);
      console.log(audio);
    }
  };

  // Helper function to convert file to Data URL
  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle post creation
  const createPostHandler = async (e) => {
    const formData = new FormData();

    if (caption) {
      formData.append("caption", caption);
    }
    // Append all selected image files to FormData
    if (files) {
      files.forEach((file) => formData.append("images", file));
    }
    // Append the audio file (if any) to FormData
    if (audio) {
      formData.append("audio", audio);
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/addpost`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        setFiles([]);
        setImagePreviews([]);
        setAudio(null); // Clear the audio
        setCaption("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={currentStep === 2}>
      <DialogContent
        className="max-w-[90%] sm:max-w-lg rounded-lg"
        onInteractOutside={() => setCurrentStep(1)}
      >
        <DialogHeader className="text-center font-semibold">
          Create New Post
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

        {/* Display image previews */}
        {imagePreviews?.length > 0 && (
          <div className="w-full h-64 flex flex-wrap gap-2">
            {imagePreviews?.map((preview, index) => (
              <div key={index} className="w-24 h-24 overflow-hidden rounded-md">
                <img
                  src={preview}
                  alt={`preview_img_${index}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}

        {/* Display audio preview */}
        {audio && (
          <div className="mt-3">
            <audio controls>
              <source src={URL.createObjectURL(audio)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Hidden file input for images */}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
          multiple
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
        >
          Select Images
        </Button>

        {/* Hidden file input for audio */}
        <input
          ref={audioRef}
          type="file"
          className="hidden"
          onChange={audioChangeHandler}
          accept="audio/*"
        />
        <Button
          onClick={() => audioRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
        >
          Select Audio
        </Button>

        {/* Button for posting */}
        {imagePreviews?.length > 0 || audio ? (
          loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="w-full"
            >
              Post
            </Button>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
