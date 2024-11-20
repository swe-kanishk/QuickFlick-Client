import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function MainLayout() {
  return (
    <div className='flex flex-col'>
        <LeftSidebar />
        <div className='pb-[60px] flex-1 overflow-hidden'>
          <Outlet />
        </div>
    </div>
  )
}

export default MainLayout