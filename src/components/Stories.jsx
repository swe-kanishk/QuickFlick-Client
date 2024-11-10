import React, { useState } from "react";
import { useSelector } from "react-redux";
import ViewStory from "./ViewStory";

function Stories({ user }) {
  const [loading, setLoading] = useState(false);
  const [viewStory, setViewStory] = useState(false);

  return (
    <>
      <div
        onClick={() => setViewStory(true)}
        className={`w-14 h-14 bg-pink-500 cursor-pointer flex items-center justify-center rounded-full`}
      >
        <div className="h-12 w-12 cursor-pointer rounded-full">
          <img
            src={user?.avatar}
            className="w-[4.5rem] overflow-hidden aspect-square object-cover rounded-full"
            alt=""
          />
        </div>
      </div>
      {viewStory ? <ViewStory user={user._id} setViewStory={setViewStory} /> : ""}
    </>
  );
}

export default Stories;
