import React, { useState, useRef } from "react";
import { Button } from "./ui/button"; // Replace with your Button component or use a plain <button>.
import { toast } from "sonner"; // Replace with your preferred toast library or alert.
import axios from "axios";
import { Plus, Upload } from "lucide-react"; // Assuming you're using Lucide Icons for Plus and Upload.
import { useDropzone } from "react-dropzone"; // Import react-dropzone

const UploadAudio = () => {
  const [files, setFiles] = useState({ audio: null });
  const [caption, setCaption] = useState(""); // Store caption
  const [loading, setLoading] = useState(false); // Loading state

  const audioInputRef = useRef(null); // Ref for audio input
  console.log(files)
  // Handle form submission
  const handleSubmit = async () => {
    if (!files.audio) {
      toast.error("Please upload an audio file.");
      return;
    }

    const formData = new FormData();

    // Add the audio file and caption to the FormData
    formData.append("audio", files.audio); 
    formData.append("caption", caption); 
    formData.append("type", "audio"); // Adding the type field as 'audio'

    try {
      setLoading(true);
      console.log(files.audio)
      console.log(formData.type)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/addpost`, // Make sure this is the correct endpoint for audio posts
        formData,
        {
          withCredentials: true,
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
    setFiles({ audio: null });
    setCaption("");
  };

  // Handle file drop
  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error("Only audio files are allowed.");
      return;
    }

    const audioFile = acceptedFiles[0];
    if (audioFile) {
      setFiles({ audio: audioFile });
    }
  };

  // Using react-dropzone for drag-and-drop functionality
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "audio/*", // Restrict to audio files only
    multiple: false, // Only allow one file at a time
    onDropRejected: () => {
      toast.error("Please select a valid audio file.");
    },
  });

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
      <h1 className="text-lg font-semibold mb-4">Upload Audio</h1>

      {/* Drag and Drop Area */}
      <div
        {...getRootProps()}
        className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer mb-4"
        onClick={() => audioInputRef.current?.click()} // Clicking the drop zone also triggers the file input dialog
      >
        <input {...getInputProps()} ref={audioInputRef} name="audio" className="hidden" />
        <div className="text-center">
          {files.audio ? (
            <div className="space-y-2">
              <div className="text-sm text-emerald-500">Audio selected:</div>
              <div className="text-xs text-zinc-400">{files.audio.name.slice(0, 20)}</div>
            </div>
          ) : (
            <>
              <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                <Upload className="h-6 w-6 text-zinc-400" />
              </div>
              <div className="text-sm text-zinc-400 mb-2">Drag and drop your audio file here</div>
              <Button variant="outline" size="sm" className="text-xs">
                Or choose file
              </Button>
            </>
          )}
        </div>
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
          name="caption"
        ></textarea>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Song"}
      </Button>
    </div>
  );
};

export default UploadAudio;