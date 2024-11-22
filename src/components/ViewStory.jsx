import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

function ViewStory({ user, setViewStory }) {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current story
  const [progress, setProgress] = useState(0); // Progress percentage for current story
  const storyDuration = 5000; // Duration of each story in milliseconds

  // Fetch user's stories
  const getUserStories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/stories/${user._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data.stories;
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      return [];
    }
  };

  // Load stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      const userStories = await getUserStories();
      setStories(userStories);
    };
    fetchStories();
  }, [user]);

  // Auto-advance logic for the current story
  useEffect(() => {
    if (stories.length === 0) return; // Skip if no stories

    // Reset progress to 0
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => prev + 1);
    }, storyDuration / 100);

    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1); // Go to next story
      } else {
        setViewStory(false); // Close when all stories are done
      }
    }, storyDuration);

    return () => {
      clearTimeout(timer); // Clear auto-advance timer
      clearInterval(progressInterval); // Clear progress interval
    };
  }, [currentIndex, stories.length]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1); // Manual next
    } else {
      setViewStory(false); // Close on last story
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1); // Manual previous
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex-col flex justify-center">
      <div className="flex items-center justify-between px-3 py-1 text-white">
        <div className="flex items-center justify-start gap-2">
          <p>{user?.username}</p>
          <span className="text-[12px] text-gray-300">{moment(stories.createdAt).fromNow()}</span>
        </div>
        <IoMdClose
          onClick={() => setViewStory(false)}
          className="w-6 h-6 text-white cursor-pointer hover:text-gray-400"
        />
      </div>
      {stories?.length > 0 && (
        <div className="w-full relative max-w-lg h-full flex flex-col items-center justify-center">
          {/* Progress Bars */}
          <div className="absolute top-4 left-0 w-full flex items-center space-x-1 px-4">
            {stories.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 bg-gray-700 rounded-full ${
                  index < currentIndex ? "bg-white" : ""
                }`}
              >
                {index === currentIndex && (
                  <div
                    className="h-1 bg-white rounded-full"
                    style={{
                      width: `${progress}%`,
                      transition: "width 0.1s linear",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Story Content */}
          <img
            src={stories[currentIndex]?.image[0]}
            alt="story"
            className="w-full max-h-[80vh] object-contain"
          />
          <p className="text-white mt-4 text-center">
            {stories[currentIndex]?.caption}
          </p>

          {/* Navigation Areas */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {/* Previous */}
            <div
              onClick={handlePrevious}
              className="w-1/3 h-full cursor-pointer"
            ></div>
            {/* Next */}
            <div
              onClick={handleNext}
              className="w-1/3 h-full cursor-pointer"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewStory;
