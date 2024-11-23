import React from 'react'
import { BsChat } from 'react-icons/bs';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { PiPaperPlaneTilt } from 'react-icons/pi';

function PostActions({ liked, onLikeToggle, commentsCount, onCommentClick, onShareClick, isSaved, onSaveToggle }) {
    return (
      <div className={`flex items-center justify-between mt-3`}>
        <div className={`flex items-center gap-3`}>
          {liked ? (
            <IoMdHeart
              onClick={onLikeToggle}
              size="26px"
              className={`cursor-pointer text-red-500`}
            />
          ) : (
            <IoMdHeartEmpty
              onClick={onLikeToggle}
              size="26px"
              className={`cursor-pointer`}
            />
          )}
          <BsChat
            onClick={onCommentClick}
            size="22px"
            className={`cursor-pointer hover:text-gray-600`}
          />
          <PiPaperPlaneTilt
            size="23px"
            onClick={onShareClick}
            className={`cursor-pointer hover:text-gray-600`}
          />
        </div>
        {isSaved ? (
          <FaBookmark
            size="20px"
            onClick={onSaveToggle}
            className={`cursor-pointer`}
          />
        ) : (
          <FaRegBookmark
            size="20px"
            onClick={onSaveToggle}
            className={`cursor-pointer`}
          />
        )}
      </div>
    );
  }  

export default PostActions
