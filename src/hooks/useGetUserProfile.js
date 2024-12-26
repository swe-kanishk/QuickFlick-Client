import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const getUserProfile = async (userId) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        dispatch(setUserProfile(null))
        console.log(error)
      }
    };

    fetchUserProfile();
  }, [userId]);
};

export default getUserProfile;