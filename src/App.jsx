// Import statements
import {
  createBrowserRouter,
  Link,
  Navigate,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";

// Component imports
import Signup from "./components/Signup";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import EmailVerification from "./components/EmailVerification";
import ForgotPassword from "./components/ForgotPassword";

// Redux actions
import { setSocket } from "./redux/socketSlice.js";
import {
  addUnreadMessage,
  setMessages,
  setOnlineUsers,
} from "./redux/chatSlice.js";
import { addNotification } from "./redux/realTimeNotificationSlice";
import { setAuthUser, setTheme } from "./redux/authSlice.js"; // Assuming you have this action for setting auth user
import ProtectedRoutes from "./components/ProtectedRoutes";
import VerifyAuthRoute from "./components/VerifyAuthRoute";
import AuthRoute from "./components/AuthRoute";
import ResetPassword from "./components/ResetPassword";
import NotFound from "./components/NotFound";
import Notifications from "./components/Notifications";
import { ToastContainer, toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import moment from "moment";
import { MdMessage } from "react-icons/md";
import Explore from "./components/Explore";
import "react-toastify/dist/ReactToastify.css";
import ViewPost from "./components/ViewPost";
import CreatePost from "./components/CreatePost";
import CreateStory from "./components/CreateStory";
import CreateReel from "./components/CreateShort";
import UploadAudio from "./components/UploadAudio";
import CreateBlogPost from "./components/CreateBlogPost";
import { FaMusic } from "react-icons/fa";


axios.defaults.withCredentials = true;

function App() {
  const { user, isDark } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const { messages } = useSelector((store) => store.chat);
  const { selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/check-auth`
        );
        if (response.data.success) {
          dispatch(setAuthUser(response.data.user));
          dispatch(setTheme(response.data.user.isDark));
        }
      } catch (error) {
        dispatch(setAuthUser(null));
        console.error("Authentication check failed:", error);
      }
    };

    checkAuth();
  }, [dispatch]);

  const ProtectedBrowserRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:id", element: <Profile /> },
        { path: "/account/edit", element: <EditProfile /> },
        { path: "/chat", element: <ChatPage /> },
        { path: "/notifications", element: <Notifications /> },
        { path: "/explore", element: <Explore /> },
        { path: "/viewPost/:postId", element: <ViewPost />},
      ],
    },
    {
      path: "/signup",
      element: <AuthRoute element={<Signup />} />,
    },
    {
      path: "/login",
      element: <AuthRoute element={<Login />} />,
    },
    {
      path: "/verify-auth",
      element: <VerifyAuthRoute element={<EmailVerification />} />,
    },
    {
      path: "/forgot-password",
      element: <AuthRoute element={<ForgotPassword />} />,
    },
    {
      path: "/reset-password/:token",
      element: <AuthRoute element={<ResetPassword />} />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  const CustomToast = ({ newMessage }) => (
      <div className="flex flex-col gap-1 bg-orange-600 w-full text-white max-w-lg rounded-xl px-3 py-2">
        <div className="flex justify-between">
          <span className="font-medium text-sm flex items-center gap-2">
            <MdMessage size={"20px"} />
            New Message!
          </span>
          <span className="text-[12px]">
            {moment(newMessage?.createdAt).fromNow()}
          </span>
        </div>
        <div className="flex gap-2">
          <Avatar className="min-w-10 min-h-10 rounded-full aspect-square object-cover overflow-hidden">
            <AvatarImage
              src={newMessage?.sender?.avatar}
              className="object-cover w-10 h-10 rounded-full aspect-square"
              alt="userProfile"
            />
            <AvatarFallback>
              <img
                src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                className="object-cover w-10 h-10 rounded-full aspect-square"
                alt=""
              />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium text-sm">{newMessage?.sender?.username}</p>
            <p className="text-sm">{newMessage?.message}</p>
          </div>
        </div>
      </div>

  );
  const NotificationToast = ({ notification }) => (
    <div className={`min-w-full w-[300px] max-w-lg ${isDark ? 'bg-white text-black' : 'bg-black text-white'} flex justify-between items-center rounded-xl p-3 gap-3`}>    
    <div className="flex gap-3 flex-1 items-center">
      <Avatar className="w-[4rem] h-[4rem] rounded-full overflow-hidden">
        <AvatarImage
          src={notification?.sender?.avatar}
          className="w-[4rem] h-[4rem] rounded-full object-cover aspect-square overflow-hidden"
          alt="user-avatar"
        />
        <AvatarFallback>
          <img
            src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
            alt=""
            className="w-[4rem] h-[4rem] rounded-full object-cover aspect-square overflow-hidden"
          />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col justify-center">
        <span className="font-semibold text-sm">
          {notification?.sender?.username}
        </span>
        <p>{notification?.message}</p>
      </div>
  </div>
      <div className="flex gap-[5px] justify-center items-center">
      <div className="flex gap-[3px] flex-col justify-center items-center">
      {notification?.postId?.type === "post" && (
        <Avatar className="w-[3rem]  h-[3rem] rounded-lg overflow-hidden">
          <AvatarImage
            src={notification?.postId?.images[0]}
            className="w-[3rem] h-[3rem] rounded-lg object-cover aspect-square overflow-hidden"
            alt="user-avatar"
          />
          <AvatarFallback>
            <img
              src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
              alt=""
              className="w-[3rem] h-[3rem] rounded-lg object-cover aspect-square overflow-hidden"
            />
          </AvatarFallback>
        </Avatar>
      )}
      {notification?.postId?.type === "short" && (
        <video src={video} className="h-12 aspect-square object-cover"></video>
      )}
      {notification?.postId?.type === "blog" && (
        <div className="h-12 w-16 border-1 flex items-center justify-center border border-gray-400 p-1 aspect-square overflow-hidden text-[10px] object-cover">
          <p className="h-12 w-16 aspect-square overflow-hidden text-[6px] object-cover">{notification?.postId?.content}</p>
        </div>
      )}
      {notification?.postId?.type === "audio" && (
        <div className='rounded-full mx-auto  bg-gradient-to-br from-[#ff48b6] via-[#4673ef] to-[#ffffff] overflow-hidden relative h-12 w-12'>
        <div className='h-8 w-8 rounded-full p-1  absolute mx-auto left-2 flex items-center bg-black justify-center top-2'>
          <span className='h-6 w-6 z-20 flex items-center justify-center text-white bg-gradient-to-br from-teal-800  to-green-500 rounded-full '>
            <FaMusic size={12} />
          </span>
        </div>
        </div>
      )}
      <p className="text-[12px]">{moment(notification?.createdAt).fromNow()}</p>
      </div>
      {notification?.isRead && (
        <span className="h-3 w-3 right-0 rounded-full bg-blue-700"></span>
      )}
      </div>
</div>

  );
  

  useEffect(() => {
    if (user) {
      const socketio = io(import.meta.env.VITE_API_URL, {
        query: { userId: user._id },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      // Listening to socket events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        toast(<NotificationToast notification={notification} />, {
          autoClose: 3000, // 3 seconds auto close
          // className: "toast-custom",
          hideProgressBar: false,
          // position: "top-right top-[92px]",
        });
        console.log("new notification", notification);
        dispatch(addNotification(notification));
      });

      socketio.on("newMessage", (newMessage) => {
        const { senderId, receiverId } = newMessage;
        console.log(newMessage);
        toast(<CustomToast newMessage={newMessage} />, {
          autoClose: 3000, // 3 seconds auto close
          className: "toast-custom",
          hideProgressBar: true,
          // position: "top-right top-[92px]",
        });
        if (selectedUser && senderId === selectedUser?._id) {
          dispatch(setMessages([...messages, newMessage]));
        } else {
          dispatch(addUnreadMessage({ userId: senderId }));
        }
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={ProtectedBrowserRouter} />
      <ToastContainer  />
    </>
  );
}

export default App;
