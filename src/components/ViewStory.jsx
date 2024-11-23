import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

function ViewStory({ storiesUser, setViewStory }) {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current story
  const [progress, setProgress] = useState(0); // Visual progress state
  const progressIntervalRef = useRef(null); // Reference for progress interval
  const storyDuration = 5000; // Duration of each story in milliseconds

  const { user } = useSelector(store => store.auth)

  // Fetch user's stories
  const getUserStories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/stories/${storiesUser._id}`,
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
  }, [storiesUser]);

  // Auto-advance logic for the current story
  useEffect(() => {
    if (stories.length === 0) return; // Skip if no stories

    // Reset progress to 0
    setProgress(0);

    // Start the progress bar
    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressIntervalRef.current); // Stop progress interval
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1); // Advance to next story
          } else {
            setViewStory(false); // Close when all stories are done
          }
          return 0; // Reset progress for the next story
        }
        return prevProgress + 1; // Increment progress
      });
    }, storyDuration / 100);

    return () => {
      clearInterval(progressIntervalRef.current); // Cleanup interval
    };
  }, [currentIndex, stories.length, setViewStory]);

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
    <div className="fixed inset-0 bg-black z-50 flex-col flex items-start justify-center">
      {stories?.length > 0 && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Progress Bars */}
          <div className="fixed top-4 left-0 w-full flex flex-col gap-3">
            <div className="flex items-center space-x-1 px-4">
            {stories?.map((_, index) => (
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
            <div className="flex items-center justify-between px-4 text-white">
              <div className="flex items-center justify-start gap-2">
              <Avatar>
              <AvatarImage className='h-10 w-10 rounded-full overflow-hidden object-cover' src={storiesUser?.avatar} alt="img" />
              <AvatarFallback>
                <img
                  className='h-10 w-10 rounded-full overflow-hidden object-cover'
                  src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                  alt=""
                />
              </AvatarFallback>
            </Avatar>
                <div className="flex flex-col">
                <p className="text-sm">{storiesUser?._id === user?._id ? 'You' : storiesUser?.username}</p>
                <span className="text-[12px] text-gray-300">
                  {moment(stories[currentIndex]?.createdAt).fromNow()}
                </span>
                </div>
              </div>
              <IoMdClose
                onClick={() => setViewStory(false)}
                className="w-6 h-6 text-white cursor-pointer hover:text-gray-400"
              />
            </div>
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
