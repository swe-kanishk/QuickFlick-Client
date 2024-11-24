import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ProgressBar } from "react-step-progress-bar";
import { toast } from "sonner";
import axios from "axios";

const CreatePost = () => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [song, setSong] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();

  // Handle image selection
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }
    setFiles(selectedFiles);
    const previews = await Promise.all(selectedFiles.map(readFileAsDataURL));
    setImagePreviews(previews);
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  // Move to the next or previous step
  const nextStep = () => {
    if (step === 1 && files.length === 0) {
      toast.error("Please upload at least one image to proceed.");
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
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("song", song);
    files.forEach((file) => formData.append("images", file));
    collaborators.forEach((collaborator) =>
      formData.append("collaborators", collaborator)
    );

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/addpost`,
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
    setFiles([]);
    setImagePreviews([]);
    setCaption("");
    setTitle("");
    setDescription("");
    setLocation("");
    setSong("");
    setCollaborators([]);
    setStep(1);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-md shadow-md p-6">
        {/* Heading */}
        <h1 className="text-xl font-semibold text-center mb-4">
          Create New Post
        </h1>

        {/* Progress Bar */}
        <ProgressBar currentStep={step} totalSteps={6} />

        {/* Form Steps */}
        <div className="mt-6">
          {step === 1 && (
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-lg font-semibold">Upload Images</h2>
              <input
                ref={imageRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <Button onClick={() => imageRef.current.click()}>
                Select Images
              </Button>
              <div className="grid grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="w-24 h-24 overflow-hidden rounded-md"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Add Details</h2>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded-md"
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Add Caption</h2>
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Set Location</h2>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border p-2 rounded-md"
              />
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Add a Song</h2>
              <input
                type="text"
                placeholder="Song Name"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                className="border p-2 rounded-md"
              />
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Collaborators</h2>
              <Textarea
                placeholder="Invite collaborators (optional)"
                value={collaborators}
                onChange={(e) => setCollaborators(e.target.value.split(","))}
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
          {step < 6 ? (
            <Button onClick={nextStep} className="bg-blue-500 hover:bg-blue-600">
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;