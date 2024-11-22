// Import statements
import {
  createBrowserRouter,
  Link,
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


axios.defaults.withCredentials = true;

function App() {
  const { user } = useSelector((store) => store.auth);
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
        console.log("new notification", notification);
        dispatch(addNotification(notification));
      });

      socketio.on("newMessage", (newMessage) => {
        const { senderId, receiverId } = newMessage;
        console.log(newMessage);
        toast(<CustomToast newMessage={newMessage} />, {
          autoClose: 3000, // 3 seconds auto close
          className: "toast-custom",
          hideProgressBar: false,
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
      <ToastContainer />
    </>
  );
}

export default App;
