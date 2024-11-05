import store from '@/redux/store'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers  from '../components/SuggestedUsers'

function RightSidebar() {
  const {user} = useSelector(store => store.auth)
  return (
    <div className='w-[35%] flex justify-center px-6'>
      <div className='w-[90%] my-10'>
      <Link to={`/profile/${user?._id}`} className="flex items-center gap-2">
          <Avatar className="w-8 h-8 rounded-full overflow-hidden">
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
            <span className='text-gray-400 text-sm relative bottom-1'>{user?.bio || 'Bio here...'}</span>
          </span>
        </Link>
        <SuggestedUsers />
    </div>
    </div>
  )
}

export default RightSidebar
