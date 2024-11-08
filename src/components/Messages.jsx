import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import useGetAllMessages from "../hooks/UseGetAllMessages.js";
import useGetRealTimeMessages from "@/hooks/useGetRealTimeMessages";
import { setMessages } from "@/redux/chatSlice";
import { setLikeNotification } from "@/redux/realTimeNotificationSlice";

function Messages({ selectedUser }) {
  useGetAllMessages();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector(store => store.auth)

  const dispatch = useDispatch();
  console.log('messages', messages)
  useEffect(() => {
    return () => {
      dispatch(setMessages([]))
      dispatch(setLikeNotification([]))
    }
  }, [selectedUser, dispatch])
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-20 h-20 rounded-full overflow-hidden">
            <AvatarImage
              src={selectedUser?.avatar}
              className="w-20 h-20 rounded-full object-cover aspect-square overflow-hidden"
              alt="user-avatar"
            />
            <AvatarFallback>
              <img
                src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                alt=""
              />
            </AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            return (
              <div key={msg?._id} className={`flex ${msg?.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg max-w-xs break-words  ${msg?.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{msg?.message}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Messages;
