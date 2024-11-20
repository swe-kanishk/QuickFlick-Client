import React, { useEffect, useState } from 'react'
import Feed from './Feed'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import getAllPosts from '@/hooks/useGetAllPosts'
import getSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import Stories from './Stories'
import { useDispatch, useSelector } from 'react-redux'
import CreateStories from './CreateStories'
import { HiMiniPaperAirplane } from "react-icons/hi2";
import { MdLightMode } from "react-icons/md";
import { HiMoon } from "react-icons/hi2";
import axios from 'axios'
import { toast } from 'sonner'
import { setTheme } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

function Home() {
  getAllPosts()
  getSuggestedUsers()

  const [story, setViewStory] = useState(false);
  const { user, isDark } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const handleLightAndDarkMode = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/update-theme`, { withCredentials: true })
      if(response.data.success){
        toast.success(response.data.message)
        console.log(response.data)
        dispatch(setTheme(response.data.isDark))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const { unreadMessages } = useSelector((store) => store.chat);
  const unreadUsers =
    unreadMessages &&
   Object.keys(unreadMessages).filter((userId) => unreadMessages[userId] > 0);

  return (
    <div  className={`flex flex-col ${isDark ? 'bg-[#151515]' : 'bg-white'} h-screen pb-5 overflow-scroll`}>
      <div className={`flex fixed items-center top-0 z-50 right-0 w-full px-3 py-4 justify-between md:hidden ${isDark ? 'bg-[#151515]' : 'bg-white'}`}>
        <Link to={`/profile/${user._id}`} className='flex gap-2 items-start'>
          <div className='h-12 w-12 rounded-full relative'>
            <Avatar>
              <AvatarImage className='h-12 w-12 rounded-full overflow-hidden object-cover' src={user?.avatar} alt="img" />
              <AvatarFallback>
                <img
                  className='h-12 w-12 rounded-full overflow-hidden object-cover'
                  src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                  alt=""
                />
              </AvatarFallback>
            </Avatar>
            <div className={`h-4 w-4 rounded-full ${isDark ? 'bg-[#151515]' : 'bg-white'} absolute top-0 flex items-center justify-center right-0`}><span className='bg-green-600 h-[0.6rem] w-[0.6rem] rounded-full absolute'></span></div>
          </div>
          <div className='flex flex-col items-start justify-center'>
            <p className={`text-[12px] font-medium ${isDark ? 'text-yellow-400' : 'text-blue-600'}`}>Hello, {user?.username || 'unknown!'}</p>
            <span className={`text-[15px] ${isDark ? 'text-white' : 'text-black'}`}>welcome to <span className='font-semibold'>QuickFlick</span> 👋🏼</span>
          </div>
        </Link>
        <div className='flex relative justify-center gap-5 items-center'>
          <HiMiniPaperAirplane onClick={() => navigate('/chat')} className={`cursor-pointer rotate-[-50deg] ${isDark ? 'text-white' : 'text-black'} w-5 h-5`} />
          {
            isDark ? <MdLightMode  onClick={handleLightAndDarkMode} className={`${isDark ? 'text-white' : 'text-black'} w-5 h-5 cursor-pointer relative top-[2px]`} /> : <HiMoon onClick={handleLightAndDarkMode} className={`${isDark ? 'text-white' : 'text-black'} relative top-[1px] cursor-pointer w-5 h-5`} />
          }
          {
            unreadUsers?.length ? <> <span className='bg-red-500 h-2 w-2 absolute left-[-3px] bottom-[-5px] rounded-full'></span> </> : ''
          }
          {
            unreadUsers?.length ? <span className={`${isDark ? 'text-black bg-white' : 'text-white bg-black'} absolute left-3 z-10 bottom-3 w-4 h-4 flex text-[12px] font-semibold items-center justify-center p-1 rounded-full`}>{unreadUsers?.length}</span> : ''
          }
          
        </div>
      </div>
      <div className="flex-1 md:mt-0 mt-[90px] px-3 w-full overflow-x-scroll flex flex-col justify-start border-r border-gray-300">
        <div className='flex items-center justify-start gap-5'>
        <CreateStories user={user} />
        <Stories />
        </div>
       <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home