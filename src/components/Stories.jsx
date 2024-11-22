import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ViewStory from "./ViewStory";

function Stories() {
  const [viewStory, setViewStory] = useState(null); // Selected story to view
  const { user, isDark } = useSelector((store) => store.auth);

  const storiesUser = user?.following?.filter((followingPeople) =>
    followingPeople?.stories?.length ? followingPeople._id : null
  );

  return (
    <>
      <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar p-2">
        {storiesUser?.map((story) => (
          <div key={story?._id} className="flex flex-col items-center gap-2">
            <div
              onClick={() => setViewStory(story)}
              className="relative w-16 h-16 cursor-pointer"
            >
              {/* Animated border */}
              <div className="absolute inset-0 rounded-full animate-spin-slow border-4 border-transparent bg-gradient-to-tr from-yellow-400 via-pink-500 to-red-500"></div>

              {/* User avatar */}
              <div className="absolute inset-1 w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={story?.avatar || ""}
                  className="w-full h-full object-cover rounded-full"
                  alt="Story Avatar"
                />
              </div>
            </div>
            <span
              className={`text-xs ${
                isDark ? "text-white" : "text-black"
              } text-center`}
            >
              {story?.username}
            </span>
          </div>
        ))}
      </div>

      {viewStory && (
        <ViewStory
          user={viewStory}
          setViewStory={setViewStory}
        />
      )}
    </>
  );
}

export default Stories;