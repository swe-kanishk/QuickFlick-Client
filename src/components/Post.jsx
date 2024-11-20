import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsChat } from "react-icons/bs";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa6";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import axios from "axios";
import { IoMdHeart } from "react-icons/io";
import moment from "moment";
import { FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";

function Post({ post }) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { user, isDark } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  const [postlikes, setPostLikes] = useState(post?.likes.length);
  const [comments, setComments] = useState(post?.comments);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else setText("");
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedPost(null));
    };
  }, []);

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/${action}`,
        {
          withCredentials: true,
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postlikes - 1 : postlikes + 1;
        toast.success(res.data.message);
        setLiked(!liked);

        const updatedPost = posts.map((p) => {
          return p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p;
        });
        dispatch(setPosts(updatedPost));

        setPostLikes(updatedLikes);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const postCommentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/comment`,
        { text },
        {
          withCredentials: true,
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data.success) {
        const updatedCommentData = [res.data.comment, ...comments];
        setComments(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleFollowUnfollow = async (userId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/followorunfollow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
  
      if (response.data.success) {
        toast.success(response.data.message);
  
        const isFollowing = response.data.isFollowing;
        // Dispatch the updated user to Redux
        dispatch(setAuthUser(response.data.user));
      }
    } catch (error) {
      console.log(error);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`mt-4 w-full px-5 py-6 rounded-[3rem] ${
        isDark ? "bg-[#212121] text-white" : "bg-[#f3f3f3] text-black"
      } max-w-md mx-auto`}
    >
      <div className={`flex items-center justify-between`}>
        <Link
          to={`/profile/${post?.author._id}`}
          className={`flex items-center gap-3`}
        >
          <Avatar className={`w-8 h-8 rounded-full overflow-hidden`}>
            <AvatarImage src={post?.author?.avatar} alt="@shadcn" />
            <AvatarFallback>
              <img
                src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                alt=""
              />
            </AvatarFallback>
          </Avatar>
          <div className={`flex items-center`}>
            <div className="flex flex-col justify-center">
              <h1>{post?.author?.username}</h1>
              <span className="text-[12px] text-gray-400">
                Posted {moment(post.createdAt).fromNow()}.
              </span>
            </div>
            {post?.author?._id === user?._id && (
              <span
                className={`text-xs ml-5 px-2 py-1 ${
                  isDark ? "bg-gray-100 text-black" : "bg-gray-700 text-white"
                } font-medium rounded-sm`}
              >
                Author
              </span>
            )}
          </div>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className={`cursor-pointer`} />
          </DialogTrigger>
          <DialogContent
            className={`grid text-sm max-w-[90%] sm:max-w-lg rounded-lg place-items-center text-center px-3 py-2 bg-white`}
          >
            {post?.author._id !== user?._id &&
              (user?.following?.includes(post?.author?._id) ? (
                <Button
                  variant="ghost"
                  className={`cursor-pointer border-none outline-none w-full font-bold`}
                  onClick={() => handleFollowUnfollow(post?.author?._id)}
                >Unfollow</Button>
              ) : (
                <Button
                  variant="ghost"
                  className={`cursor-pointer border-none outline-none w-full font-bold`}
                  onClick={() => handleFollowUnfollow(post?.author?._id)}
                >Follow</Button>
              ))}
            <Button variant="ghost" className={`cursor-pointer w-full`}>
              Add to favourites
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className={`cursor-pointer w-full`}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <p className="my-5 mx-2">{post.caption}</p>
      <div className={`my-5 rounded-[2.5rem] overflow-hidden`}>
        <img
          className={`object-cover aspect-square w-full`}
          src={post?.image}
          alt=""
        />
      </div>
      <div className={`flex items-center justify-between mt-3`}>
        <div className={`flex items-center gap-3`}>
          {liked ? (
            <IoMdHeart
              onClick={likeOrDislikeHandler}
              size="26px"
              className={`cursor-pointer text-red-500`}
            />
          ) : (
            <IoMdHeartEmpty
              onClick={likeOrDislikeHandler}
              size="26px"
              className={`cursor-pointer`}
            />
          )}
          <BsChat
            onClick={() => {
              setOpen(true);
              dispatch(setSelectedPost(post));
            }}
            size="22px"
            className={`cursor-pointer hover:text-gray-600`}
          />
          <PiPaperPlaneTilt
            size="23px"
            className={`cursor-pointer hover:text-gray-600`}
          />
        </div>
        {user?.saved.includes(post._id) ? (
          <FaBookmark
            size="20px"
            onClick={savePostHandler}
            className={`cursor-pointer`}
          />
        ) : (
          <FaRegBookmark
            size="20px"
            onClick={savePostHandler}
            className={`cursor-pointer`}
          />
        )}
      </div>
      <span className={`font-medium block mt-1`}>
        {post.likes.length} likes
      </span>
      {comments.length > 0 && (
        <span
          onClick={() => {
            setOpen(true);
            dispatch(setSelectedPost(post));
          }}
          className={`text-gray-400 cursor-pointer`}
        >
          View all {comments.length} comments
        </span>
      )}
      <CommentDialog
        open={open}
        setOpen={setOpen}
        post={post}
        liked={liked}
        setLiked={setLiked}
        likeOrDislikeHandler={likeOrDislikeHandler}
        postCommentHandler={postCommentHandler}
        text={text}
        setText={setText}
      />
      <div className={`flex items-center justify-between`}>
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className={`outline-none text-sm w-full mt-1 ${
            isDark ? "bg-[#212121]" : "bg-[#f3f3f3]"
          }`}
        />
        {text && (
          <span
            className={`text-[#3BADF8] cursor-pointer`}
            onClick={postCommentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
