import React from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

function PostHeader({post}) {
  const { user, isDark } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const savePostHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/save`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.type == "saved") {
          const updatedUser = { ...user, saved: [...user.saved, post?._id] };
          dispatch(setAuthUser(updatedUser));
        } else {
          const updatedUser = {
            ...user,
            saved: user.saved.filter((postId) => postId !== post._id),
          };
          dispatch(setAuthUser(updatedUser));
        }
      }
    } catch (error) {
      toast.error("something went wrong!");
    }
  };


  const handleFollowUnfollow = async (userId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/user/followorunfollow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        const isFollowing = response.data.isFollowing;
        // Dispatch the updated user to Redux
        console.log(response.data.user)
        dispatch(setAuthUser(response.data.user));
      }
    } catch (error) {
      toast.error("something went wrong!");
      toast.error("An error occurred. Please try again.");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/post/delete/${post?._id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: token,
          },
        }
      );
      const updatedPostData = posts.filter(
        (postItem) => postItem?._id !== post?._id
      );
      dispatch(setPosts(updatedPostData));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.res.data.message);
    }
  };

  return (
    <div className={`${
          isDark ? "bg-[#212121] text-white" : "bg-[#f3f3f3] text-black"
        } flex items-center`}>
      <div
        onClick={() => navigate(`/profile/${post?.author?._id}`)}
        className="flex flex-1 items-center gap-3"
      >
        <Avatar className="w-8 h-8 rounded-full overflow-hidden">
          <AvatarImage src={post?.author?.avatar} alt="@shadcn" />
          <AvatarFallback>
            <img
              src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
              alt="Fallback"
            />
          </AvatarFallback>
        </Avatar>
        <div className="flex w-full justify-between pr-3 items-center">
          <div className="flex flex-col items-start justify-center">
            <h1>{post?.author?.username}</h1>
            <span className="text-[12px] text-gray-400">
              Posted {moment(post?.createdAt).fromNow()}.
            </span>
          </div>
          {post?.author?._id === user?._id ? (
            <span
              className={`text-xs ml-5 px-2 py-1 ${
                isDark ? "bg-gray-100 text-black" : "bg-gray-700 text-white"
              } font-medium rounded-sm`}
            >
              Author
            </span>
          ) : (
            <span
              className={`text-xs relative px-3 py-[6px] ${
                isDark
                  ? user?.following?.some(
                      (person) => person?._id === post?.author?._id
                    )
                    ? "bg-gray-700"
                    : "bg-blue-500 text-white"
                  : user?.following?.some(
                      (person) => person?._id === post?.author?._id
                    )
                  ? "bg-gray-400 left-[65%]"
                  : "bg-blue-500 text-white left-[90%]"
              } font-medium rounded-sm cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                handleFollowUnfollow(post?.author?._id);
              }}
            >
              {user?.following?.some(
                (person) => person?._id === post?.author?._id
              )
                ? "Unfollow"
                : "Follow"}
            </span>
          )}
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <MoreHorizontal className="cursor-pointer" />
        </DialogTrigger>
        <DialogContent className="grid text-sm max-w-[90%] sm:max-w-lg rounded-lg place-items-center text-center px-3 py-2 bg-white">
          {post?.author?._id !== user?._id && (
            <Button
              variant="ghost"
              className="cursor-pointer border-none outline-none w-full font-bold"
              onClick={() => handleFollowUnfollow(post?.author?._id)}
            >
              {user?.following?.some(
                (person) => post?.author?._id === person?._id
              )
                ? "Unfollow"
                : "Follow"}
            </Button>
          )}
          <Button
            onClick={savePostHandler}
            variant="ghost"
            className="cursor-pointer w-full"
          >
            {user.saved.includes(post._id)
              ? "Remove from Collections"
              : "Add to Collections"}
          </Button>
          {user && user?._id === post?.author?._id && (
            <Button
              onClick={deletePostHandler}
              variant="ghost"
              className="cursor-pointer w-full"
            >
              Delete
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PostHeader;
