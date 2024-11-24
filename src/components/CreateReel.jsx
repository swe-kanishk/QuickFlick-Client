import React, { useState } from "react";
import { Button } from "./ui/button"; // Replace with your Button component or use a plain <button>.
import { toast } from "sonner"; // Replace with your preferred toast library or alert.
import axios from "axios";

const CreateReel = () => {
  const [video, setVideo] = useState(null); // Store video file
  const [caption, setCaption] = useState(""); // Store caption text
  const [loading, setLoading] = useState(false); // Loading state

  // Validate and set the video
  const handleVideoChange = (e) => {
    const selectedVideo = e.target.files[0];
    if (!selectedVideo) {
      toast.error("Please select a video.");
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(selectedVideo);

    videoElement.onloadedmetadata = () => {
      if (videoElement.duration > 30) {
        toast.error("Video must be 30 seconds or less.");
      } else {
        setVideo(selectedVideo);
      }
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!video) {
      toast.error("Please upload a video.");
      return;
    }

    const formData = new FormData();
    const token = localStorage.getItem("token");

    formData.append("caption", caption);
    formData.append("video", video);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/reel/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setVideo(null);
    setCaption("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-md shadow-md p-6">
        {/* Heading */}
        <h1 className="text-xl font-semibold text-center mb-4">Create Reel</h1>

        {/* Video Upload */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold">Upload Video</h2>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="border p-2 rounded"
          />
          {video && (
            <div className="mt-4">
              <video
                src={URL.createObjectURL(video)}
                controls
                className="w-64 h-64 rounded-md"
              />
            </div>
          )}
        </div>

        {/* Caption Input */}
        <div className="flex flex-col gap-4 mb-6">
          <h2 className="text-lg font-semibold">Add Caption</h2>
          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border p-2 rounded resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Reel"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateReel;