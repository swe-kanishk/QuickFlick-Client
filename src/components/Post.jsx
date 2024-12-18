import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IoMdHeartEmpty } from "react-icons/io";
import { BsChat } from "react-icons/bs";
import {
  PiPaperPlaneTilt,
  PiSpeakerSimpleHighFill,
  PiSpeakerSimpleSlashFill,
} from "react-icons/pi";
import { FaLinkedin, FaRegBookmark, FaRegCopy } from "react-icons/fa6";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import axios from "axios";
import { IoMdHeart } from "react-icons/io";
import moment from "moment";
import { FaBookmark } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";
import Carousel from "./Carousel";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebookF,
  FaEnvelope,
  FaTelegramPlane,
  FaWhatsapp,
  FaLink,
} from "react-icons/fa";
import PostActions from "./PostActions";
import AudioPlayer from "./AudioPlayer";
import AudioPostPlayer from "./AudioPostPlayer";

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
        if(res.data.type == "saved") {
          const updatedUser = {...user, saved: [...user.saved, post?._id]}
          dispatch(setAuthUser(updatedUser))
        }
        else {
          const updatedUser = {...user, saved: user.saved.filter((postId) => postId !== post._id)}
          dispatch(setAuthUser(updatedUser))
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.href}viewPost/${post?._id}`
    );
    toast.success("Link copied to clipboard!");
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
  const navigate = useNavigate()
  return (
    <>
      <div
        className={`mt-4 min-w-screen relative px-5 py-6 rounded-[2rem] ${
          isDark ? "bg-[#212121] text-white" : "bg-[#f3f3f3] text-black"
        } max-w-md mx-auto`}
        onClick={handleDoubleTap}
      >
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate(`/profile/${post?.author?._id}`)}
            className="flex items-center gap-3"
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
            <div className="flex items-center">
              <div className="flex flex-col justify-center">
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
                  className={`text-xs relative px-2 py-1 ${
                    isDark ? 
                    user?.following?.some((person) => person?._id === post?.author?._id) ? "bg-gray-700 left-[65%]" : "bg-blue-500 text-white left-[90%]"
                    : user?.following?.some((person) => person?._id === post?.author?._id) ? "bg-gray-400 left-[65%]" : "bg-blue-500 text-white left-[90%]"
                  } font-medium rounded-sm cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFollowUnfollow(post?.author?._id)
                  }}
                >
                  { user?.following?.some((person) => person?._id === post?.author?._id) ? "Unfollow" : "Follow"}
                </span>
              )}
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="grid text-sm max-w-[90%] sm:max-w-lg rounded-lg place-items-center text-center px-3 py-2 bg-white">
              {post?.author?._id !== user?._id &&
                (
                  <Button
                    variant="ghost"
                    className="cursor-pointer border-none outline-none w-full font-bold"
                    onClick={() => handleFollowUnfollow(post?.author?._id)}
                  >
                    {user?.following?.some((person) => post?.author?._id === person?._id) ? "Unfollow" : "Follow"}
                  </Button>
                )}
              <Button onClick={savePostHandler} variant="ghost" className="cursor-pointer w-full">
                {user.saved.includes(post._id) ? "Remove from Collections" : "Add to Collections"}
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
            <video src={post?.video} loop={3} muted controls className="w-full rounded-lg"></video>
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
                  whiteSpace: "pre-wrap"
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

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="p-5 mx-auto w-[90%] max-w-lg rounded-lg bg-white text-center shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Share this Post</h2>
          <div className="flex justify-evenly gap-8 mb-2">
            <FacebookShareButton
              url={`${window.location.href}viewPost/${post?._id}`}
            >
              <span className="flex items-center justify-center p-2 overflow-hidden aspect-square bg-blue-600 rounded-full">
                <FaFacebookF className="h-5 w-5 text-white" />
              </span>
            </FacebookShareButton>
            <EmailShareButton
              url={`${window.location.href}viewPost/${post?._id}`}
            >
              <span className="flex items-center justify-center p-3 overflow-hidden aspect-square bg-black rounded-full">
                <FaEnvelope className="h-5 w-5 text-white" />
              </span>
            </EmailShareButton>
            <TelegramShareButton
              url={`${window.location.href}viewPost/${post?._id}`}
            >
              <span className="flex items-center justify-center p-2 overflow-hidden aspect-square bg-blue-600 rounded-full">
                <FaTelegramPlane className="h-6 w-6 text-white" />
              </span>
            </TelegramShareButton>
            <WhatsappShareButton
              url={`${window.location.href}viewPost/${post?._id}`}
            >
              <span className="flex items-center justify-center p-2 overflow-hidden aspect-square bg-green-600 rounded-full">
                <FaWhatsapp className="h-6 w-6 text-white" />
              </span>
            </WhatsappShareButton>
            <LinkedinShareButton
              url={`${window.location.href}viewPost/${post?._id}`}
            >
              <span className="flex items-center justify-center p-2 overflow-hidden aspect-square bg-blue-600 rounded-full">
                <FaLinkedin className="h-6 w-6 text-white" />
              </span>
            </LinkedinShareButton>
          </div>
          <span className="mx-auto font-semibold">or</span>
          <input
            type="text"
            value={`${window.location.href}viewPost/${post?._id}`}
            disabled
            className="px-3 py-2 rounded-xl border border-blue-600"
          />
          <Button
            variant="ghost"
            className="w-fit mx-auto bg-blue-700 text-white hover:bg-blue-600 flex items-center justify-center gap-2 hover:text-white text-sm"
            onClick={copyLink}
          >
            <FaRegCopy />
            <span>Copy Link</span>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Post;
