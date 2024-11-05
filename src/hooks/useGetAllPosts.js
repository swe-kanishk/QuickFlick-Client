import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const getAllPosts = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get("https://quickflick-server.onrender.com/api/v1/post/all", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        dispatch(setPosts([]))
        console.log(error)
      }
    };

    fetchAllPosts();
  }, [dispatch]);
};

export default getAllPosts;