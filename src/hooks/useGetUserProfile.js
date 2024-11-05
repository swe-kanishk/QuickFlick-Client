import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const getUserProfile = async (userId) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`https://quickflick-server.onrender.com/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });
        console.log(res)
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        dispatch(setUserProfile(null))
      }
    };

    fetchUserProfile();
  }, [userId]);
};

export default getUserProfile;