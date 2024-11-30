import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"; // Import Dialog components
import { toast } from "sonner";
import axios from "axios";
import { Plus, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

const UploadAudio = ({ setCurrentStep, currentStep }) => {
  const [files, setFiles] = useState({ audio: null });
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const audioInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!files.audio) {
      toast.error("Please upload an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", files.audio);
    formData.append("caption", caption);
    formData.append("type", "audio");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/addpost`,
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

  const resetForm = () => {
    setFiles({ audio: null });
    setCaption("");
  };

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "audio/*",
    multiple: false,
    onDropRejected: () => {
      toast.error("Please select a valid audio file.");
    },
  });

  return (
      <Dialog open={currentStep === 2}>
        <DialogContent
          className="max-w-[90%] sm:max-w-lg rounded-lg"
          onInteractOutside={() => setCurrentStep(1)}
        >
          <DialogHeader className="text-center font-semibold">
            Upload Audio
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Drag and Drop Area */}
            <div
              {...getRootProps()}
              onClick={() => audioInputRef.current?.click()}
              className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
            >
              <input {...getInputProps()} ref={audioInputRef} className="hidden" />
              <div className="text-center">
                {files.audio ? (
                  <div className="space-y-2">
                    <div className="text-sm text-emerald-500">Audio selected:</div>
                    <div className="text-xs text-zinc-400">
                      {files.audio.name.slice(0, 20)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                      <Upload className="h-6 w-6 text-zinc-400" />
                    </div>
                    <div className="text-sm text-zinc-400">
                      Drag and drop your audio file here
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Caption */}
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter caption"
              className="block w-full p-2 border rounded-md"
            ></textarea>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {loading ? "Uploading..." : "Upload Song"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default UploadAudio;