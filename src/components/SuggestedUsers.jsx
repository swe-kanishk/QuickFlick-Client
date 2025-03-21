
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import LargeTextHandler from './LargeTextHandler';

function SuggestedUsers() {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch()


  const handleFollowUnfollow = async (userId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/followorunfollow/${userId}`,
        {},
        {
          withCredentials: true,
        }
      );
  
      if (response.data.success) {
        toast.success(response.data.message);
  
        const isFollowing = response.data.isFollowing;
        // Dispatch the updated user to Redux
        dispatch(setAuthUser(response.data.user));
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="my-8">
      <div className="flex items-center justify-between gap-4 py-3 text-sm">
        <h1 className="font-semibold text-gray-500">Suggested for you</h1>
        <span className="cursor-pointer text-blue-500 font-medium">See All</span>
      </div>
      {suggestedUsers?.map((suggestedUser) => {
        return (
          <div key={suggestedUser._id} className="my-3 flex items-start justify-between w-full">
            <div

              className="flex items-start gap-3"
            >
              <Link className='flex items-center justify-center' to={`/profile/${suggestedUser?._id}`}>
              <Avatar className="max-h-8 max-w-8 min-h-8 min-w-8 rounded-full object-cover overflow-hidden">
                <AvatarImage src={suggestedUser?.avatar} alt="@shadcn" />
                <AvatarFallback>
                  <img
                    src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                    alt=""
                  />
                </AvatarFallback>
              </Avatar>
              </Link>
              <span className="flex flex-col justify-center items-start">
                <h1>{suggestedUser?.username}</h1>
                <span className="text-gray-400 text-sm relative bottom-1">
                  {suggestedUser?.bio ? LargeTextHandler(suggestedUser?.bio, 30) : "Bio here..."}
                </span>
              </span>
            </div>
            <span onClick={() => handleFollowUnfollow(suggestedUser._id)} className='text-[#3BADF8] text-sm cursor-pointer ml-3 hover:text-[#5287f0] font-medium'>{
            user?.following.some((followingUser) => followingUser._id === suggestedUser._id) ? 'Following' : 'follow'
            }</span>
            </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;