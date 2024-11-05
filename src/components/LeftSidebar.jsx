import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Logo from "./Logo";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Button } from "./ui/button";
import {
  resetNotificationUnreadCount,
  setLikeNotification,
} from "@/redux/realTimeNotificationSlice";
import useGetRealTimeMessages from "@/hooks/useGetRealTimeMessages";

function LeftSidebar() {
  useGetRealTimeMessages();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { totalUnreadChats } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    try {
      const res = await axios.post("https://quickflick-server.onrender.com/api/v1/user/logout");
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const { likeNotification, notificationUnreadCount } = useSelector(
    (store) => store.realTimeNotification
  );

  const sidebarItems = [
    { icon: <Home size={26} />, label: "Home" },
    { icon: <Search size={26} />, label: "Search" },
    { icon: <TrendingUp size={26} />, label: "Explore" },
    { icon: <MessageCircle size={26} />, label: "Messages" },
    { icon: <Heart size={26} />, label: "Notifications" },
    { icon: <PlusSquare size={26} />, label: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.avatar} alt="@shadcn" />
          <AvatarFallback>
            <img
              src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
              alt=""
            />
          </AvatarFallback>
        </Avatar>
      ),
      label: "Profile",
    },
    { icon: <LogOut size={24} />, label: "Logout" },
  ];
  const [openNotificationBar, setOpenNotificationBar] = useState(false);
  const sidebarHandler = (props) => {
    switch (props) {
      case "Logout":
        return logoutHandler();

      case "Profile":
        return navigate(`/profile/${user?._id}`);

      case "Home":
        return navigate("/");

      case "Create":
        return setOpen(true);

      case "Messages":
        return navigate("/chat");

      case "Notifications":
        return setOpenNotificationBar(!openNotificationBar);
    }
  };

  useEffect(() => {
    if (openNotificationBar) {
      dispatch(resetNotificationUnreadCount());
    }
  }, [openNotificationBar, dispatch]);

  const { unreadMessages } = useSelector((store) => store.chat);
  const unreadUsers =
    unreadMessages &&
    Object.keys(unreadMessages).filter((userId) => unreadMessages[userId] > 0);

  return (
    <div className="flex h-full">
      <div className="flex bg-white justify-start py-8 z-50 flex-col h-screen min-w-[250px] max-w-[300px] border-r border-1">
        <div className="px-10">
          <Logo />
        </div>
        <ul className="flex flex-col gap-2 px-6 py-6">
          {sidebarItems.map((item) => {
            return (
              <li
                onClick={() => sidebarHandler(item.label)}
                key={item.label}
                className={`flex gap-5 py-2 justify-start cursor-pointer px-3 text-[16px] rounded-lg hover:bg-gray-300 items-center ${
                  item.label === "Logout"
                    ? "absolute bottom-4 w-[13.5rem] left-4"
                    : "relative"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {(item.label === "Notifications" && notificationUnreadCount) ||
                (item.label === "Messages" && unreadUsers?.length) ? (
                  <Button
                    size="icon"
                    className="rounded-full  h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                  >
                    {`${
                      (item.label === "Notifications" &&
                        (notificationUnreadCount || "")) ||
                      (item.label === "Messages" && (unreadUsers?.length || ""))
                    }`}
                  </Button>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div
        className={`p-6 w-1/5 border-r border-gray-300 fixed top-0 left-[250px] z-30 h-full bg-white transition-transform duration-300 ${
          openNotificationBar
            ? "translate-x-0 ease-in delay-200"
            : "-translate-x-full delay-200"
        }`}
      >
        {likeNotification?.length === 0 ? (
          <p>No new notification</p>
        ) : (
          likeNotification.map((notification) => {
            return (
              <div
                key={notification.postId}
                className="flex items-center gap-2 my-2"
              >
                <Avatar>
                  <AvatarImage src={notification.userDetails?.avatar} />
                  <AvatarFallback>
                    <img
                      src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                      alt=""
                    />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm">
                  <span className="font-bold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  liked your post.
                </p>
              </div>
            );
          })
        )}
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftSidebar;
