import React, { useState } from "react";
import { Button } from "./ui/button"; // Assuming you're using a custom Button component
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"; // Assuming you're using a Dialog component
import { toast } from "sonner"; // Assuming you're using Sonner for toasts
import axios from "axios";

const CreateBlogPost = ({ setCurrentStep, currentStep }) => {
  const [title, setTitle] = useState(""); // Store the blog title
  const [content, setContent] = useState(""); // Store the content of the blog
  const [loading, setLoading] = useState(false); // Loading state

  // Handle form submission
  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error("Title and content are required.");
      return;
    }

    const formData = {
      title,
      content,
      type: "blog",
    };

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        resetForm();
        setCurrentStep(1) // Close the dialog on success
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Reset the form after a successful submission
  const resetForm = () => {
    setTitle("");
    setContent("");
  };

  return (
    <Dialog open={currentStep === 2}>
      <DialogContent className="max-w-[90%] sm:max-w-lg rounded-lg" onInteractOutside={() => setCurrentStep(1)}>
        <DialogHeader className="text-center font-semibold">
          Create Blog Post
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* Blog Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title for your blog..."
              className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Blog Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={6}
            ></textarea>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Create Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogPost;