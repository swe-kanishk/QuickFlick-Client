import { addUnreadMessage, setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRealTimeMessages = () => {
  const dispatch = useDispatch();
  const {socket} = useSelector(store => store.socketio)
  const {messages} = useSelector(store => store.chat)
  const { selectedUser } = useSelector(store => store.auth);
  console.log('req to aaya')
  useEffect(() => {
    socket?.on('newMessage', (newMessage) => {
      const { senderId, receiverId } = newMessage;
      console.log('messages', messages)
      console.log('newMessages', newMessage)
      if (selectedUser && senderId === selectedUser?._id) {
        dispatch(setMessages([...messages, newMessage]))
      }
      else {
        dispatch(addUnreadMessage({ userId: senderId }));
      }
    })

    return () => {
        socket?.off('newMessage')
    }
  }, [messages, selectedUser, dispatch, setMessages]);
};

export default useGetRealTimeMessages;