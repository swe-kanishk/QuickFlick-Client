import { setAllNotifications } from "@/redux/realTimeNotificationSlice.js";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useFetchNotifications = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllNotifications = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/notifications`, { withCredentials: true });
                if (response.data.success) {
                    dispatch(setAllNotifications(response.data.notifications));
                }
            } catch (error) {
                console.log("Error fetching notifications:", error);
            }
        };
        
        fetchAllNotifications();
    }, [dispatch]);
};

export default useFetchNotifications;
