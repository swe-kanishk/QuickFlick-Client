import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Post from "./Post";
import { useSelector } from "react-redux";
import getAllPosts from "@/hooks/useGetAllPosts";
import { FaRegWindowClose } from "react-icons/fa";

function ViewPost() {
  getAllPosts();

  const { postId } = useParams();
  const { posts } = useSelector((store) => store.post);

  const navigate = useNavigate()

  const sharedPost = posts.filter((post) => post._id === postId);
  return (
    <div className="flex h-screen w-full items-center relative justify-center">
        <FaRegWindowClose className="absolute top-4 right-3 text-2xl cursor-pointer text-red-500" onClick={() => navigate('/')} />
        {
            sharedPost ? <Post post={sharedPost[0]} /> : <p className="text-red-500 font-bold text-2xl">Post Not found!</p>
        }
        
    </div>
  );
}

export default ViewPost;
