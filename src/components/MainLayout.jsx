import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

function MainLayout() {
  return (
    <div className='flex'>
        <LeftSidebar />
        <div className='flex-1'>
          <Outlet />
        </div>
    </div>
  )
}

export default MainLayout
