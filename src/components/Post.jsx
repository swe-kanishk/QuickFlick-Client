
import React, { useEffect, useState } from "react";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import axios from "axios";
import { IoMdHeart } from "react-icons/io";
import { setAuthUser } from "@/redux/authSlice";
import Carousel from "./Carousel";
import PostActions from "./PostActions";
import AudioPlayer from "./AudioPlayer";
import AudioPostPlayer from "./AudioPostPlayer";
import ShareDialog from "./ShareDialog";
import PostHeader from "./PostHeader";

function Post({ post }) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { user, isDark } = useSelector((store) => store.auth);
  const [showFullContent, setShowFullContent] = useState(false);
  const { posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  const [postlikes, setPostLikes] = useState(post?.likes.length);
  const [comments, setComments] = useState(post?.comments);
  const [shareOpen, setShareOpen] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  let lastTap = 0;

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

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // Time interval for detecting double-tap in ms
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      setShowHeart(true); // Show heart animation
      setTimeout(() => setShowHeart(false), 1000); // Remove heart animation after 1s
      likeOrDislikeHandler();
    }
    lastTap = now;
  };
  return (
    <>
      <div
        className={`mt-4 min-w-screen relative px-5 py-6 rounded-[2rem] ${
          isDark ? "bg-[#212121] text-white" : "bg-[#f3f3f3] text-black"
        } max-w-md mx-auto`}
        onClick={handleDoubleTap}
      >
        <PostHeader post={post} />
        {post?.type === "post" && (
          <>
            <p className="my-5 mx-2">{post?.caption}</p>
            {post?.audio && <AudioPlayer post={post} />}
            <div className="my-5 relative rounded-[1rem] overflow-hidden">
              <Carousel slides={post.images} />
              {showHeart && (
                <IoMdHeart
                  size={50}
                  className="absolute text-white z-50 top-[45%] left-[45%] mx-auto transform animate-ping"
                />
              )}
            </div>
          </>
        )}
        {post?.type === "audio" && (
          <div>
            <p className="my-5 mx-2">{post.caption}</p>
            <AudioPostPlayer audioSrc={post?.audio} />
            {showHeart && (
              <IoMdHeart
                size={50}
                className="absolute text-white z-50 top-[45%] left-[45%] mx-auto transform animate-ping"
              />
            )}
          </div>
        )}
        {post?.type === "short" && (
          <div>
            <p className="my-5 mx-2">{post?.caption}</p>
            <div className="flex items-center justify-center max-h-[25rem] overflow-hidden bg-transparent">
              <video
                src={post?.video}
                loop={3}
                muted
                controls
                className="w-full rounded-lg"
              ></video>
              {showHeart && (
                <IoMdHeart
                  size={50}
                  className="absolute text-white z-50 top-[45%] left-[45%] mx-auto transform animate-ping"
                />
              )}
            </div>
          </div>
        )}
        {post?.type === "blog" && (
          <div className="flex flex-col gap-3 mt-4 bg-transparent py-3 px-3 rounded-lg">
            <h1 className="font-bold">{post?.title}</h1>
            <div className="relative">
              <p
                className={`text-gray-500 inline-block cursor-pointer ${
                  showFullContent ? "" : "max-h-[10.7em] overflow-hidden" // 10 lines visible
                }`}
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: showFullContent ? "none" : 20, // Clamp to 10 lines
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "pre-wrap",
                }}
              >
                {post?.content}
              </p>
              {post?.content?.length > 150 && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="text-blue-500 text-[15px] relative bottom-1"
                >
                  {showFullContent ? "See less" : "...See more"}
                </button>
              )}
            </div>
            {showHeart && (
              <IoMdHeart
                size={50}
                className="absolute text-white z-50 top-[45%] left-[45%] mx-auto transform animate-ping"
              />
            )}
          </div>
        )}
        <PostActions
          liked={liked}
          onLikeToggle={likeOrDislikeHandler}
          commentsCount={comments.length}
          onCommentClick={() => {
            setOpen(true);
            dispatch(setSelectedPost(post));
          }}
          onShareClick={() => setShareOpen(true)}
          isSaved={user?.saved?.includes(post._id)}
          onSaveToggle={savePostHandler}
        />

        <span className="font-medium block mt-1">
          {post.likes.length} likes
        </span>
        {comments.length > 0 && (
          <div
            onClick={() => {
              setOpen(true);
              dispatch(setSelectedPost(post));
            }}
          >
            <span className="text-gray-400 font-medium cursor-pointer">
              View all {comments.length} comments
            </span>
            <p className="font-medium text-sm text-gray-400">
              {comments[0].author.username}:{" "}
              <span className="text-xs">
                {comments[0]?.text.length > 40
                  ? comments[0]?.text.substr(0, 40) + "..."
                  : comments[0]?.text}
              </span>
            </p>
          </div>
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
            className={`outline-none text-sm w-full mt-1 ${
              isDark ? "bg-[#212121]" : "bg-[#f3f3f3]"
            }`}
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
         <ShareDialog shareOpen={shareOpen} setShareOpen={setShareOpen} post={post} /> 
    </>
  );
}

export default Post;
