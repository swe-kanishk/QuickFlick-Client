import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ViewStory from "./ViewStory";
import axios from "axios";

function Stories() {
  const [loading, setLoading] = useState(false);
  const [viewStory, setViewStory] = useState(null); // Change to null to store the story to view

  const { user, isDark } = useSelector((store) => store.auth);
  const storiesUser = user?.following.filter((follower) => follower.stories)
  return (
    <>
      <div className="flex items-center space-x-4">
        {storiesUser?.map((story) => (
          <div className="flex flex-col justify-center items-center gap-[5px]">
          <div
            key={story._id}
            onClick={() => setViewStory(story)}
            className="w-14 h-14 bg-pink-500 cursor-pointer flex items-center justify-center rounded-full"
          >
            <div className="h-12 w-12 cursor-pointer rounded-full">
              <img
                src={story?.avatar || ""}
                className="w-[4.5rem] overflow-hidden aspect-square object-cover rounded-full"
                alt=""
              />
            </div>
          </div>
          <div className={`flex flex-col text-[12px] items-center gap-[5px] ${isDark ? 'text-white' : 'text-black'}`}><span>{story.username}</span></div>

            </div>
        ))}
      </div>
      {viewStory && (
        <ViewStory user={viewStory._id} setViewStory={setViewStory} />
      )}
    </>
  );
}

export default Stories;