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
import CreateDialog from "./CreateDialog";

function LeftSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isDark } = useSelector((store) => store.auth);
  const { unreadCount } = useSelector((store) => store.realTimeNotification);
  const [active, setActive] = useState("Home");

  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/logout`
      );
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
    { icon: <TrendingUp size={22} />, label: "Explore" },
    { icon: <MessageCircle size={22} />, label: "Messages" },
    { icon: <PlusSquare size={22} />, label: "Create" },
    { icon: <Home size={22} />, label: "Home" },
    { icon: <Heart size={22} />, label: "Notifications" },
    {
      icon: (
        <Avatar className="w-[22px] h-[22px]">
          <AvatarImage
            src={user?.avatar}
            className="h-[22px] w-[22px] border-white rounded-full overflow-hidden object-cover"
            alt="@shadcn"
          />
          <AvatarFallback> border
            <img
              src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
              alt=""
              className="h-[22px] w-[22px] rounded-full overflow-hidden object-cover"
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
        return;

      case "Notifications":
        navigate("/notifications");
        setActive("Notifications");
        return;

      case "Explore":
        navigate("/explore");
        setActive("Explore");
        return;
    }
  };

  return (
    <>
      <div className="flex z-[100] md:z-50 fixed md:relative bottom-0 md:bg-white h-[60px] bg-transparent md:overflow-hidden justify-between md:justify-start md:py-8 flex-row md:flex-col md:h-screen md:min-w-[250px] w-full md:max-w-[300px] border-r border-1 ">
        <div className="px-10 hidden md:flex">
          <Logo />
        </div>
        <ul className={`flex justify-between items-center ${isDark ? 'bg-[#161616]' : 'bg-white'} md:justify-start w-full mx-auto  md:flex-col gap-2 px-6 md:py-6`}>
          {sidebarItems.map((item) => {
            return (
              <li
                onClick={() => sidebarHandler(item.label)}
                key={item.label}
                className={`flex flex-col text-white items-center justify-center
                  ${
                    item.label === "Logout"
                      ? "absolute hidden md:flex bottom-4 w-[13.5rem] left-4"
                      : "relative"
                  } ${item.label === "Messages" ? "hidden md:flex" : ""}`}
              >
                <span className={`${isDark ? `hover:bg-white hover:text-black ${active === item.label ? 'text-black bg-white' : 'text-white'}` : `hover:bg-black hover:text-white ${active === item.label ? 'text-white bg-black' : 'text-black'}`}  hover:text-black rounded-full p-[7px] flex items-center justify-center `}>{item.icon}</span>
                <span className={`flex text-[10px] ${isDark ? `bg-[#161616] text-white ` : 'bg-white text-black'}`}>{item.label}</span>
                {item.label === "Notifications" && unreadCount ? (
                  <>
                    <span
                      className={`absolute bottom-5 right-[-6px] bg-black rounded-full text-white h-5 w-5 text-[12px] flex items-center justify-center`}
                    >
                      {unreadCount}
                    </span>
                    <span className="absolute h-2 w-2 bg-black rounded-full bottom-0"></span>
                  </>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>
      </div>
      {/* <CreateDialog open={open} setOpen={setOpen} /> */}
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
}

export default LeftSidebar;
