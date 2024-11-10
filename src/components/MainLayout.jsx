import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function MainLayout() {
  return (
    <div className='flex'>
        <LeftSidebar />
        <div className='max-h-[calc(100vh-60px)] flex-1 overflow-hidden'>
          <Outlet />
        </div>
    </div>
  )
}

export default MainLayout