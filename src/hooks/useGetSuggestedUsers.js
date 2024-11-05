import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const getSuggestedUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get("https://quickflick-server.onrender.com/api/v1/user/suggested", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
          return
        }

        if(!res.data.success) {
          toast.error(res.data.message)
          navigate('/login')
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuggestedUsers();
  }, []);
};

export default getSuggestedUsers;