import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";

const CreateStory = () => {
  const [step, setStep] = useState(1);
  const [media, setMedia] = useState(null); // Single media (image or video)
  const [caption, setCaption] = useState("");
  const [song, setSong] = useState("");
  const [mentions, setMentions] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef();

  // Handle media (image or video) selection
  const handleMediaChange = (e) => {
    const selectedMedia = e.target.files[0];
    if (!selectedMedia) {
      toast.error("Please select a media file.");
      return;
    }
    setMedia(selectedMedia);
  };

  // Move to the next or previous step
  const nextStep = () => {
    if (step === 1 && !media) {
      toast.error("Please upload a media file to proceed.");
      return;
    }
    setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  // Handle form submission
  const handleSubmit = async () => {
    const formData = new FormData();
    const token = localStorage.getItem("token");

    formData.append("caption", caption);
    formData.append("song", song);
    formData.append("media", media);
    formData.append("mentions", mentions);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/story/upload`,
        formData,
        {
          withCredentials: true,
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

  const resetForm = () => {
    setMedia(null);
    setCaption("");
    setSong("");
    setMentions("");
    setStep(1);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-md shadow-md p-6">
        {/* Heading */}
        <h1 className="text-xl font-semibold text-center mb-4">Create Story</h1>

        {/* Form Steps */}
        <div className="mt-6">
          {step === 1 && (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-lg font-semibold">Upload Media</h2>
              <input
                ref={mediaRef}
                type="file"
                onChange={handleMediaChange}
                accept="image/*,video/*"
                className="border p-2 rounded"
              />
              {media && (
                <div className="mt-4">
                  {media.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(media)}
                      alt="Story Media Preview"
                      className="w-64 h-64 object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(media)}
                      controls
                      className="w-64 h-64 rounded-md"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Add Caption</h2>
              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border p-2 rounded resize-none"
                rows={4}
              />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Add Song</h2>
              <input
                placeholder="Song Name or Link"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                className="w-full border p-2 rounded"
                type="text"
              />
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Mention People</h2>
              <textarea
                placeholder="Mention people (use @ to mention)"
                value={mentions}
                onChange={(e) => setMentions(e.target.value)}
                className="w-full border p-2 rounded resize-none"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button onClick={prevStep} className="bg-gray-200 hover:bg-gray-300">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={nextStep} className="bg-blue-500 hover:bg-blue-600">
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Story"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStory;