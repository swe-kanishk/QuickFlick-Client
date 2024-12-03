import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useFetchNotifications from "../hooks/useFetchNotifications.js";
import { allRead } from "@/redux/realTimeNotificationSlice.js";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import moment from "moment";
import axios from "axios";
import { FaRegBell } from "react-icons/fa6";
import { FaMusic } from "react-icons/fa";
import { Link } from "react-router-dom";

function Notifications() {
  const dispatch = useDispatch();

  useFetchNotifications();
  useEffect(() => {
    dispatch(allRead());
  }, [dispatch]);

  const { allNotifications, realTimeNotifications } = useSelector(
    (store) => store.realTimeNotification
  );
  const { isDark } = useSelector(
    (store) => store.auth
  );

  const Notifications = allNotifications?.concat(realTimeNotifications);

  (async () => {
    const unreadNotificationIds = Notifications?.filter(
      (notification) => !notification?.isRead
    ).map((notification) => notification?._id);

    try {
      if (unreadNotificationIds.length > 0) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/notifications/mark-read`,
          {
            notificationIds: unreadNotificationIds,
          },
          { withCredentials: true }
        );
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  })();
  console.log(Notifications)
  return (
    <div className={`p-3 flex h-[calc(100vh-60px)] md:h-screen flex-col gap-3 ${isDark ? 'bg-[#151515] text-white' : 'bg-white'}`}>
        <div className="border-b border-gray-200">
            <p className="text-xl my-3 font-semibold flex items-center gap-2"><FaRegBell className="rotate-[-30deg] font-semibold" /> Notifications </p>
        </div>
      {Notifications?.length ?
        Notifications?.map((notification) => {
          return (
            <div key={notification?._id} className="w-full relative flex justify-between items-center rounded-xl p-3 gap-3">
                
              <Link to={`/profile/${notification.sender._id}`} className="flex gap-3 items-center">
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
            </Link>
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
                {!notification?.isRead && (
                  <span className="h-3 w-3 right-0 rounded-full bg-blue-700"></span>
                )}
                </div>
              </div>
          );
        }) : (
          <div className="text-xl font-semibold my-auto mx-auto">No Notifcations</div>
        )}
    </div>
  );
}

export default Notifications;