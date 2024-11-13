import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useFetchAllMessages = () => {
  const { selectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllMessages = async () => {
      if (!selectedUser) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/message/all/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        } else {
          dispatch(setMessages([]));
        }
      } catch (error) {
        dispatch(setMessages([]));
        console.error("Error fetching messages:", error);
      }
    };

    fetchAllMessages();
  }, [selectedUser, dispatch]);
};

export default useFetchAllMessages;
