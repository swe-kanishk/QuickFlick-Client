import React, { useState } from "react";
import { Button } from "./ui/button"; // Replace with your Button component or use a plain <button>.
import { toast } from "sonner"; // Replace with your preferred toast library or alert.
import axios from "axios";

const CreateBlogPost = () => {
  const [title, setTitle] = useState(""); // Store title
  const [content, setContent] = useState(""); // Store content of the blog (joke, poem, etc.)
  const [caption, setCaption] = useState(""); // Store caption (optional)
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
      caption,
    };

    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/blog/create`,
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
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Reset form after successful submission
  const resetForm = () => {
    setTitle("");
    setContent("");
    setCaption("");
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-md">
      <h1 className="text-lg font-semibold mb-4">Create Blog Post</h1>

      {/* Blog Title */}
      <div className="mb-4 w-full">
        <label htmlFor="title" className="block mb-2 font-medium">
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="block w-full p-2 border rounded-md"
        />
      </div>

      {/* Blog Content (Joke, Poem, etc.) */}
      <div className="mb-4 w-full">
        <label htmlFor="content" className="block mb-2 font-medium">
          Content:
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post here"
          className="block w-full p-2 border rounded-md"
          rows="6"
        ></textarea>
      </div>

      {/* Optional Caption */}
      <div className="mb-4 w-full">
        <label htmlFor="caption" className="block mb-2 font-medium">
          Caption (Optional):
        </label>
        <input
          type="text"
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Enter an optional caption"
          className="block w-full p-2 border rounded-md"
        />
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
  );
};

export default CreateBlogPost;