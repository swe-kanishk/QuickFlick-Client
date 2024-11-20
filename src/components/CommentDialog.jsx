import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { BsChat } from "react-icons/bs";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({
  open,
  setOpen,
  liked,
  setLiked,
  likeOrDislikeHandler,
}) => {
  const dispatch = useDispatch();
  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user, isDark } = useSelector((store) => store.auth);
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  const eventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  useEffect(() => {
    setComments(selectedPost?.comments)
  }, [selectedPost])

  const sentMessageHandler = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${selectedPost?._id}/comment`,
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
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className={`max-w-5xl md:h-[75%] h-full p-0 flex flex-col rounded-l-lg overflow-hidden ${isDark ? 'bg-[#151515] text-white' : 'bg-white'}`}
      >
        <div className="flex flex-1 md:border-r border-gray-300 flex-col md:flex-row overflow-y-scroll">
        <div className="flex md:hidden items-center justify-between p-4 md:border-b border-gray-300">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex max-w-[90%] sm:max-w-lg rounded-lg flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                  <div className="cursor-pointer w-full font-semibold text-red-500" onClick={() => setOpen(false)}>Close</div>
                </DialogContent>
              </Dialog>
            </div>
          <div className="md:w-3/5 flex items-center justify-center h-[50%] md:h-full object-cover w-full">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-auto h-full object-center object-cover"
            />
          </div>
          <div className="md:w-[55%] w-full h-full flex flex-col">
            <div className="md:flex hidden items-center justify-between p-4 md:border-b border-gray-300">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="w-full p-4 flex flex-col border-b md:h-[75%] flex-1 items-start border-gray-300 overflow-scroll">
              {comments?.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="py-4 pb-[80px] md:pb-4">
              <div className="flex justify-between pr-3 border-b border-gray-300">
                <div className="flex gap-4 pb-4 pl-3">
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
                    onClick={() => setOpen(true)}
                    size={"22px"}
                    className="cursor-pointer  hover:text-gray-600"
                  />
                  <PiPaperPlaneTilt
                    size={"23px"}
                    className="cursor-pointer  hover:text-gray-600"
                  />
                </div>
                <FaRegBookmark size={"20px"} className="cursor-pointer" />
              </div>

              <div className="flex items-center gap-2 mt-2 pl-3">
                <input
                  type="text"
                  value={text}
                  onChange={eventHandler}
                  placeholder="Add a comment..."
                  className={`w-full outline-none border-none text-sm border-gray-300 p-2 rounded ${isDark ? 'bg-[#151515]' : 'bg-white'}`}
                />
                <button
                  disabled={!text.trim()}
                  onClick={sentMessageHandler}
                  className={` ${
                    text ? "text-blue-600" : "text-blue-300"
                  } pr-3 cursor-pointer`}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
