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

function Post({ post }) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
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
      dispatch(setSelectedPost(null))
    }
  },[])
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";

      const res = await axios.get(
        `https://quickflick-server.onrender.com/api/v1/post/${post?._id}/${action}`,
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
        `https://quickflick-server.onrender.com/api/v1/post/${post?._id}/comment`,
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

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://quickflick-server.onrender.com/api/v1/post/delete/${post?._id}`,
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
        `https://quickflick-server.onrender.com/api/v1/post/${post?._id}/save`,
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
    <div className="mt-4 w-full border-b border-gray-300 py-3 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 rounded-full overflow-hidden">
            <AvatarImage src={post?.author?.avatar} alt="@shadcn" />
            <AvatarFallback>
              <img
                src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                alt=""
              />
            </AvatarFallback>
          </Avatar>
          <span className="flex items-center gap-2">
            <h1>{post?.author?.username}</h1>
            {post?.author?._id === user?._id && (
              <span className="text-xs px-2 py-1 bg-gray-100 font-medium rounded-sm">
                Author
              </span>
            )}
          </span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="grid text-sm place-items-center text-center px-3 py-2 rounded-md bg-white">
            {post?.author._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer border-none outline-none w-full font-bold"
              >
                Unfollow
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-full">
              Add to favourites
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
      <div className="border-2 border-gray-400 my-2 rounded-sm overflow-hidden">
        <img
          className="object-cover aspect-square w-full"
          src={post?.image}
          alt=""
        />
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          {liked ? (
            <IoMdHeart
              onClick={likeOrDislikeHandler}
              size={"26px"}
              className="cursor-pointer text-red-500"
            />
          ) : (
            <IoMdHeartEmpty
              onClick={likeOrDislikeHandler}
              size={"26px"}
              className="cursor-pointer"
            />
          )}
          <BsChat
            onClick={() => {
              setOpen(true);
              dispatch(setSelectedPost(post));
            }}
            size={"22px"}
            className="cursor-pointer  hover:text-gray-600"
          />
          <PiPaperPlaneTilt
            size={"23px"}
            className="cursor-pointer  hover:text-gray-600"
          />
        </div>
        <FaRegBookmark
          size={"20px"}
          onClick={savePostHandler}
          className="cursor-pointer"
        />
      </div>
      <span className="font-medium block mt-1">{postlikes} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {comments.length > 0 && (
        <span
          onClick={() => {
            setOpen(true);
            dispatch(setSelectedPost(post));
          }}
          className="text-gray-400 cursor-pointer"
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
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full mt-1"
        />
        {text && (
          <span
            className="text-[#3BADF8] cursor-pointer"
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
