import { setSelectedUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Cross, MessageCircleCode } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdCloseCircle } from "react-icons/io";
import Messages from "./Messages";
import axios from "axios";
import { markMessagesAsRead, setMessages } from "@/redux/chatSlice";

function ChatPage() {
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();

  const sendMessageHandler = async (recieverId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `https://quickflick-server.onrender.com/api/v1/message/send/${recieverId}`,
        { textMessage },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json", Authorization: token },
        }
      );

      if (res.data.success) {
        console.log(res.data.newMessage)
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log('err is', error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null))
    }
  }, [dispatch])

  const { unreadMessages } = useSelector(store => store.chat);

  return (
    <div className="flex h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-semibold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 text-gray-300" />
        <div className="h-[80vh] overflow-y-auto">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers?.includes(suggestedUser?._id);
            const isUnreadMessages = unreadMessages?.hasOwnProperty(`${suggestedUser?._id}`) && unreadMessages[`${suggestedUser?._id}`];
            return (
              <div
              key={suggestedUser?._id}
                onClick={() => {
                  dispatch(setSelectedUser(suggestedUser))
                  dispatch(markMessagesAsRead({userId: suggestedUser?._id}))
                }}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-[4rem] h-[4rem] rounded-full overflow-hidden">
                  <AvatarImage src={suggestedUser?.avatar} alt="user-avatar" />
                  <AvatarFallback>
                    <img
                      src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                      alt=""
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`flex gap-6 w-full ${
                      isOnline ? "text-green-600" : "text-red-600"
                    } text-xs font-bold`}
                  >
                    {isOnline ? "online" : "offline"}
                    <span className="text-gray-500 font-medium">{isUnreadMessages ?  `${isUnreadMessages} new ${isUnreadMessages > 1 ? 'messages' : 'message'}!` : ""}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l flex flex-col border-gray-300 h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white">
            <Avatar className="w-[4rem] h-[4rem] rounded-full overflow-hidden">
              <AvatarImage
                src={selectedUser?.avatar}
                className="w-[4rem] h-[4rem] rounded-full object-cover aspect-square overflow-hidden"
                alt="user-avatar"
              />
              <AvatarFallback>
                <img
                  src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                  alt=""
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center justify-between">
              <span>{selectedUser?.username}</span>
              <IoMdCloseCircle
                size={"30px"}
                className="cursor-pointer text-red-600 hover:text-gray-500"
                onClick={() => dispatch(setSelectedUser(null))}
              />
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-gray-300">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              placeholder="Message..."
              className="flex-1 mr-2 focus-visible:ring-transparent outline-none"
            />
            <button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center mx-auto flex-1 border-l border-gray-300 h-full">
          <MessageCircleCode className="w-32 h-32 my-4 text-gray-700" />
          <h1 className="text-2xl text-gray-700 font-semibold">
            Your messages
          </h1>
          <span className="font-medium">Send a message to start a chat!</span>
        </section>
      )}
    </div>
  );
}

export default ChatPage;