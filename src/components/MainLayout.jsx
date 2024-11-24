import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function MainLayout() {
  return (
    <div className='flex flex-col md:flex-row'>
        <LeftSidebar />
        <div className='pb-[60px] md:p-0 flex-1 overflow-hidden'>
          <Outlet />
        </div>
    </div>
  )
}

export default MainLayout