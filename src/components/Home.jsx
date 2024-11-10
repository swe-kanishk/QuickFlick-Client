import React, { useState } from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
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

function Home() {
  getAllPosts()
  getSuggestedUsers()
  const [story, setViewStory] = useState(false);
  const { user, isDark } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  
  const handleLightAndDarkMode = async() => {
    try {
      const response = await axios.get(`https://quickflick-server.onrender.com/api/v1/user/update-theme`, { withCredentials: true })
      if(response.data.success){
        toast.success(response.data.message)
        console.log(response.data)
        dispatch(setTheme(response.data.isDark))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div  className={`flex flex-col ${isDark ? 'bg-[#151515]' : 'bg-white'} h-screen overflow-scroll`}>
      <div className={`flex fixed items-center top-0 z-50 right-0 w-full px-3 py-4 justify-between md:hidden ${isDark ? 'bg-[#151515]' : 'bg-white'}`}>
        <div className='flex gap-2 items-start'>
          <div className='h-12 w-12 rounded-full relative'>
            <img src={user.avatar} className='h-12 w-12 rounded-full overflow-hidden object-cover' alt="" />
            <div className={`h-4 w-4 rounded-full ${isDark ? 'bg-[#151515]' : 'bg-white'} absolute top-0 flex items-center justify-center right-0`}><span className='bg-green-600 h-[0.6rem] w-[0.6rem] rounded-full absolute'></span></div>
          </div>
          <div className='flex flex-col items-start justify-center'>
            <p className={`text-[12px] font-medium ${isDark ? 'text-yellow-400' : 'text-blue-600'}`}>Hello, {user?.username || 'unknown!'}</p>
            <span className={`text-[15px] ${isDark ? 'text-white' : 'text-black'}`}>welcome to <span className='font-semibold'>QuickFlick</span> 👋🏼</span>
          </div>
        </div>
        <div className='flex justify-center gap-5 items-center'>
          <HiMiniPaperAirplane className={`cursor-pointer rotate-[-50deg] ${isDark ? 'text-white' : 'text-black'} w-5 h-5`} />
          {
            isDark ? <MdLightMode  onClick={handleLightAndDarkMode} className={`${isDark ? 'text-white' : 'text-black'} w-5 h-5 cursor-pointer relative top-[2px]`} /> : <HiMoon onClick={handleLightAndDarkMode} className={`${isDark ? 'text-white' : 'text-black'} relative top-[1px] cursor-pointer w-5 h-5`} />
          }
        </div>
      </div>
      <div className="flex-1 md:mt-0 mt-[90px] px-3 w-full overflow-x-scroll flex flex-col justify-start border-r border-gray-300">
        <div className='flex items-center justify-start gap-5'>
        <CreateStories user={user} />
          {user?.following?.map((userStories) => userStories ? (<div className={`flex flex-col text-[12px] items-center gap-[5px] ${isDark ? 'text-white' : 'text-black'}`}><Stories user={userStories} setViewStory={setViewStory} /> <span>{userStories.username}</span></div>) : '')}
        </div>
       <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home