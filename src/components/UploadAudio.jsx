import React, { useState } from "react";
import { Button } from "./ui/button"; // Replace with your Button component or use a plain <button>.
import { toast } from "sonner"; // Replace with your preferred toast library or alert.
import axios from "axios";

const UploadAudio = () => {
  const [audio, setAudio] = useState(null); // Store the audio file
  const [audioName, setAudioName] = useState(""); // Store audio name
  const [caption, setCaption] = useState(""); // Store caption
  const [loading, setLoading] = useState(false); // Loading state

  // Handle audio file selection
  const handleAudioChange = (e) => {
    const selectedAudio = e.target.files[0];
    if (!selectedAudio) {
      toast.error("Please select an audio file.");
      return;
    }
    setAudio(selectedAudio);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!audio) {
      toast.error("Please upload an audio file.");
      return;
    }
    if (!audioName) {
      toast.error("Please provide a name for the audio.");
      return;
    }

    const formData = new FormData();
    const token = localStorage.getItem("token");

    formData.append("audio", audio);
    formData.append("audioName", audioName);
    formData.append("caption", caption);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/audio/upload`,
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

  // Reset the form after successful submission
  const resetForm = () => {
    setAudio(null);
    setAudioName("");
    setCaption("");
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
      <h1 className="text-lg font-semibold mb-4">Upload Audio</h1>

      {/* Audio Upload */}
      <div className="mb-4 w-full">
        <label htmlFor="audio-upload" className="block mb-2 font-medium">
          Select Audio File:
        </label>
        <input
          type="file"
          id="audio-upload"
          accept="audio/*"
          onChange={handleAudioChange}
          className="block w-full p-2 border rounded-md"
        />
      </div>

      {/* Audio Name */}
      <div className="mb-4 w-full">
        <label htmlFor="audio-name" className="block mb-2 font-medium">
          Audio Name:
        </label>
        <input
          type="text"
          id="audio-name"
          value={audioName}
          onChange={(e) => setAudioName(e.target.value)}
          placeholder="Enter audio name"
          className="block w-full p-2 border rounded-md"
        />
      </div>

      {/* Caption */}
      <div className="mb-4 w-full">
        <label htmlFor="caption" className="block mb-2 font-medium">
          Caption:
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter caption"
          className="block w-full p-2 border rounded-md"
        ></textarea>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Audio"}
      </Button>
    </div>
  );
};

export default UploadAudio;