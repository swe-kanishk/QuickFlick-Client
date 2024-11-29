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

function CreateShort({ setCurrentStep, currentStep }) {
  const [video, setVideo] = useState(null); // For video
  const [audio, setAudio] = useState(null); // For optional audio
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const videoRef = useRef();
  const audioRef = useRef();

  // Handle video file change
  const videoChangeHandler = (e) => {
    const selectedVideo = e.target.files[0];
    if (selectedVideo) {
      setVideo(selectedVideo);
    }
  };

  // Handle audio file change (optional)
  const audioChangeHandler = (e) => {
    const selectedAudio = e.target.files[0];
    if (selectedAudio) {
      setAudio(selectedAudio);
    }
  };

  // Handle post creation for "short"
  const createShortHandler = async (e) => {
    const formData = new FormData();
    formData.append("type", "short");
    if (caption) {
      formData.append("caption", caption);
    }
    // Append the video file (required for shorts)
    if (video) {
      formData.append("video", video);
    }
    // Append the audio file (optional)
    if (audio) {
      formData.append("audio", audio);
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
        setCurrentStep(1); // Close the modal
        setVideo(null); // Clear the video
        setAudio(null); // Clear the audio
        setCaption(""); // Clear the caption
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
          Create New Short
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

        {/* Display video preview */}
        {video && (
          <div className="mt-3">
            <video
              controls
              className="w-full h-64 object-cover"
              src={URL.createObjectURL(video)}
            />
          </div>
        )}

        {/* Display audio preview if audio exists */}
        {audio && (
          <div className="mt-3">
            <audio controls>
              <source src={URL.createObjectURL(audio)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Hidden file input for video */}
        <input
          ref={videoRef}
          type="file"
          className="hidden"
          onChange={videoChangeHandler}
          accept="video/*"
        />
        <Button
          onClick={() => videoRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
        >
          Select Video
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
          Select Audio (Optional)
        </Button>

        {/* Button for posting */}
        {video ? (
          loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={createShortHandler} type="submit" className="w-full">
              Post
            </Button>
          )
        ) : (
          <Button disabled className="w-full bg-gray-400">
            Video is required
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreateShort;