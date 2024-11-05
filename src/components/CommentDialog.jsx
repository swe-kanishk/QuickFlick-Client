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
        `https://quickflick-server.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
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
        className="max-w-5xl h-[75%] p-0 flex flex-col rounded-l-lg overflow-hidden"
      >
        <div className="flex flex-1 border-r border-gray-300 overflow-y-scroll">
          <div className="w-3/5 bg-red-300">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-auto h-full object-center object-cover"
            />
          </div>
          <div className="w-[55%] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-300">
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
            <div className="w-full p-4 border-b h-[75%] items-start border-gray-300 overflow-scroll">
              {comments?.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="py-4">
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
                  className="w-full outline-none border-none text-sm border-gray-300 p-2 rounded"
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
