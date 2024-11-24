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
import { Link, useNavigate } from "react-router-dom";
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
          <AvatarFallback>
            {" "}
            border
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
      <div
        className={`flex md:flex-col z-[100] md:z-50 fixed bottom-0 md:relative h-[60px] md:overflow-hidden justify-between md:justify-start md:py-8 flex-row md:h-screen md:min-w-[250px] w-full md:max-w-[300px] border-r border-1 ${
          isDark ? "bg-[#161616]" : "bg-white"
        }`}
      >
        <div
          className={`md:flex items-center top-0 z-50 right-0 w-full px-6 pb-2 pt-3 justify-between hidden ${
            isDark ? "bg-[#161616]" : "bg-white"
          }`}
        >
          <Link to={`/profile/${user?._id}`} className="flex gap-2 items-start">
            <div className="h-12 w-12 rounded-full relative">
              <Avatar>
                <AvatarImage
                  className="h-12 w-12 rounded-full overflow-hidden object-cover"
                  src={user?.avatar}
                  alt="img"
                />
                <AvatarFallback>
                  <img
                    className="h-12 w-12 rounded-full overflow-hidden object-cover"
                    src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                    alt=""
                  />
                </AvatarFallback>
              </Avatar>
              <div
                className={`h-4 w-4 rounded-full ${
                  isDark ? "bg-[#151515]" : "bg-white"
                } absolute top-0 flex items-center justify-center right-0`}
              >
                <span className="bg-green-600 h-[0.6rem] w-[0.6rem] rounded-full absolute"></span>
              </div>
            </div>
            <div className="flex flex-col items-start justify-center">
              <p
                className={`text-[12px] font-medium ${
                  isDark ? "text-yellow-400" : "text-blue-600"
                }`}
              >
                Hello, {user?.username || "unknown!"}
              </p>
              <span
                className={`text-[15px] ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                welcome to <span className="font-semibold">QuickFlick</span> 👋🏼
              </span>
            </div>
          </Link>
        </div>
        <ul
          className={`flex justify-between ${
            isDark ? "bg-[#161616]" : "bg-white"
          } md:justify-start w-full mx-auto  md:flex-col md:gap-3 gap-2 px-6 md:py-6`}
        >
          {sidebarItems.map((item) => {
            return (
              <li
                onClick={() => sidebarHandler(item.label)}
                key={item.label}
                className={`group flex md:rounded-lg ${
                  isDark
                    ? `md:hover:bg-white md:hover:text-black ${
                        active === item.label
                          ? "md:text-black md:bg-white"
                          : "md:text-white"
                      }`
                    : `md:hover:bg-black md:hover:text-white ${
                        active === item.label
                          ? "md:text-white md:bg-black"
                          : "md:text-black"
                      }`
                } flex-col md:flex-row md:gap-3 md:justify-start text-white items-center justify-center
    ${
      item.label === "Logout"
        ? "absolute hidden md:flex bottom-4 w-[13.5rem] left-4"
        : "relative"
    } ${item.label === "Messages" ? "hidden md:flex" : ""}`}
              >
                <span
                  className={`rounded-full p-[7px] flex items-center justify-center
      ${
        isDark
          ? "group-hover:bg-white group-hover:text-black " +
            (active === item.label
              ? "bg-white text-black"
              : "bg-[#161616] text-white")
          : "group-hover:bg-black group-hover:text-white " +
            (active === item.label
              ? "md:bg-[#161616] md:text-white bg-black text-white"
              : "text-black")
      }`}
                >
                  {item.icon}
                </span>

                <span
                  className={`flex text-[10px] md:text-[16px] ${
                    isDark
                      ? `md:group-hover:text-black md:group-hover:bg-white ${
                          active === item.label
                            ? "md:bg-white md:text-black"
                            : "md:bg-[#161616] md:text-white"
                        }`
                      : `md:group-hover:text-white ${
                          active === item.label
                            ? "md:bg-[#161616] md:text-white text-black"
                            : "text-black"
                        }`
                  }`}
                >
                  {item.label}
                </span>

                {item.label === "Notifications" && unreadCount ? (
                  <>
                    <span className="absolute bottom-5 right-[-6px] bg-black rounded-full text-white h-5 w-5 text-[12px] flex items-center justify-center">
                      {unreadCount}
                    </span>
                    <span className="absolute h-2 w-2 bg-black rounded-full bottom-0"></span>
                  </>
                ) : null}
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
