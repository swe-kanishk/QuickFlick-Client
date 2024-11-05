
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-8">
      <div className="flex items-center justify-between gap-4 py-3 text-sm">
        <h1 className="font-semibold text-gray-500">Suggested for you</h1>
        <span className="cursor-pointer text-blue-500 font-medium">See All</span>
      </div>
      {suggestedUsers?.map((user) => {
        return (
          <div key={user._id} className="my-3 flex items-center justify-between w-full">
            <Link
              to={`/profile/${user?._id}`}
              className="flex items-center gap-3"
            >
              <Avatar className="w-8 h-8 rounded-full object-cover overflow-hidden">
                <AvatarImage src={user?.avatar} alt="@shadcn" />
                <AvatarFallback>
                  <img
                    src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                    alt=""
                  />
                </AvatarFallback>
              </Avatar>
              <span className="flex flex-col justify-center items-start">
                <h1>{user?.username}</h1>
                <span className="text-gray-400 text-sm relative bottom-1">
                  {user?.bio || "Bio here..."}
                </span>
              </span>
            </Link>
            <span className='text-[#3BADF8] text-sm cursor-pointer hover:text-[#5287f0] font-medium'>Follow</span>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;
