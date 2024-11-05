import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import getAllPosts from '@/hooks/useGetAllPosts'
import getSuggestedUsers from '@/hooks/useGetSuggestedUsers'

function Home() {
  getAllPosts()
  getSuggestedUsers()

  return (
    <div  className='flex h-screen overflow-scroll px-4'>
      <div className="flex-1 flex justify-center border-r border-gray-300">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home