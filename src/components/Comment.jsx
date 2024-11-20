import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";
import { AvatarImage } from "./ui/avatar";
import moment from "moment";
import { useSelector } from "react-redux";

function Comment({ comment }) {
  const {isDark} = useSelector(store => store.auth)

  return (
    <div className={`flex my-2 py-1 px-2 rounded-lg items-start w-full gap-2 ${isDark ? 'bg-[#151515] text-white' : 'bg-white'}`}>
      <Avatar>
        <AvatarImage
          className="h-10 w-10 rounded-full object-cover aspect-square"
          src={comment?.author?.avatar}
        />
        <AvatarFallback>
          <img
            src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
            alt=""
            className="min-h-8 min-w-8 h-8 w-8 rounded-full"
          />
        </AvatarFallback>
      </Avatar>
      <div className="w-full">
        <div className="flex items-center justify-between w-full">
          <p className="font-medium text-sm">{comment.author.username} </p>
          <span className={`text-[10px] my-1 opacity-60 font-medium`}>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <span className="font-normal pb-1 text-[14px] text-gray-500">{comment.text}</span>
      </div>
    </div>
  );
}

export default Comment;
