import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useFetchNotifications from "../hooks/useFetchNotifications.js";
import { allRead } from "@/redux/realTimeNotificationSlice.js";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import moment from "moment";
import axios from "axios";
import { FaRegBell } from "react-icons/fa6";

function Notifications() {
  const dispatch = useDispatch();

  useFetchNotifications();
  useEffect(() => {
    dispatch(allRead());
  }, [dispatch]);

  const { allNotifications, realTimeNotifications } = useSelector(
    (store) => store.realTimeNotification
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

  return (
    <div className="p-3 flex flex-col gap-3">
        <div className="border-b border-gray-200">
            <p className="text-xl my-3 font-semibold flex items-center gap-2"><FaRegBell className="rotate-[-30deg] font-semibold" /> Notifications </p>
        </div>
      {Notifications &&
        Notifications?.map((notification) => {
          return (
            <div className="w-full relative flex justify-between items-center rounded-xl p-3 gap-3">
                
              <div className="flex gap-3 items-center">
                <Avatar className="w-[4rem] h-[4rem] rounded-full overflow-hidden">
                  <AvatarImage
                    src={notification?.sender.avatar}
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
                    {notification?.sender.username}
                  </span>
                  <p>{notification.message}</p>
                </div>
            </div>
                <div className="flex gap-[5px] justify-center items-center">
                <div className="flex gap-[3px] flex-col justify-center items-center">
                {notification.postId.image && (
                  <Avatar className="w-[3rem] rounded-lg h-[3rem] rounded-lg overflow-hidden">
                    <AvatarImage
                      src={notification?.postId?.image[0]}
                      className="w-[3rem] rounded-lg h-[3rem] rounded-lg object-cover aspect-square overflow-hidden"
                      alt="user-avatar"
                    />
                    <AvatarFallback>
                      <img
                        src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                        alt=""
                        className="w-[3rem] rounded-lg h-[3rem] rounded-lg object-cover aspect-square overflow-hidden"
                      />
                    </AvatarFallback>
                  </Avatar>
                )}
                <p className="text-[12px]">{moment(notification.createdAt).fromNow()}</p>
                </div>
                {notification.isRead && (
                  <span className="h-3 w-3 right-0 rounded-full bg-blue-700"></span>
                )}
                </div>
              </div>
          );
        })}
    </div>
  );
}

export default Notifications;