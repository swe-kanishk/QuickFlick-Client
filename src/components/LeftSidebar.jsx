import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Logo from "./Logo";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import useGetRealTimeMessages from "@/hooks/useGetRealTimeMessages";

function LeftSidebar() {
  useGetRealTimeMessages();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { unreadCount } = useSelector((store) => store.realTimeNotification);
  const [active, setActive] = useState("Home");

  const dispatch = useDispatch();


  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`);
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

  const sidebarItems = [
    { icon: <TrendingUp size={26} />, label: "Explore" },
    { icon: <MessageCircle size={26} />, label: "Messages" },
    { icon: <PlusSquare size={26} />, label: "Create" },
    { icon: <Home size={26} />, label: "Home" },
    { icon: <Heart size={26} />, label: "Notifications" },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user?.avatar}
            className='h-8 w-8 rounded-full overflow-hidden object-cover'
            alt="@shadcn"
          />
          <AvatarFallback>
            <img
              src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
              alt=""
              className='h-8 w-8 rounded-full overflow-hidden object-cover'
            />
          </AvatarFallback>
        </Avatar>
      ),
      label: "Profile",
    },
    { icon: <LogOut size={24} />, label: "Logout" },
  ];

  const sidebarHandler = (props) => {
    switch (props) {
      case "Logout":
        return logoutHandler();

      case "Profile":
        navigate(`/profile/${user?._id}`);
        setActive("Profile");
        return;

      case "Home":
        navigate("/");
        setActive("Home");
        return;
        
        case "Create":
          setOpen(true);
          setActive("Create");
          return;
          
        case "Messages":
        setActive("Home");
        navigate("/chat");
        return 

      case "Notifications":
        navigate('/notifications');
        setActive("Notifications");
    }
  };

  return (
    <>
      <div className="flex fixed md:relative bottom-0 md:bg-white h-[60px] bg-pink-400 md:overflow-hidden justify-between md:justify-start md:py-8 z-50 flex-row md:flex-col md:h-screen md:min-w-[250px] w-full md:max-w-[300px] border-r border-1">
        <div className="px-10 hidden md:flex">
          <Logo />
        </div>
        <ul className="flex justify-between items-center md:justify-start w-full md:flex-col gap-2 px-6 md:py-6">
          {sidebarItems.map((item) => {
            return (
              <li
                onClick={() => sidebarHandler(item.label)}
                key={item.label}
                className={`flex ${
                  active === item.label
                    ? "bg-white rounded-full w-14 flex items-center justify-center h-14 relative bottom-5"
                    : ""
                } gap-5 py-2 md:justify-start cursor-pointer justify-center md:w-full px-3 text-[16px] h-10 w-10 items-center md:rounded-lg hover:bg-white transition-transform rounded-full md:hover:bg-gray-300 md:items-center 
                  ${
                    item.label === "Logout"
                      ? "absolute hidden md:flex bottom-4 w-[13.5rem] left-4"
                      : "relative"
                  } ${item.label === "Messages" ? "hidden md:flex" : ""}`}
              >
                <span>{item.icon}</span>
                <span className="hidden md:flex">{item.label}</span>
                {
                  item.label === 'Notifications' && unreadCount ? <><span className={`absolute bottom-5 right-[-6px] bg-black rounded-full text-white h-5 w-5 text-[12px] flex items-center justify-center`}>{unreadCount}</span><span className="absolute h-2 w-2 bg-black rounded-full bottom-0"></span></> : ''
                }
              </li>
            );
          })}
        </ul>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
}

export default LeftSidebar;
