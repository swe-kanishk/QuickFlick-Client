import React, { useEffect, useState } from 'react'
import Post from './Post'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice';

function Posts() {
  const { posts } = useSelector(store => store.post)
  const { isDark } = useSelector(store => store.auth)

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setPosts([]))
    }
  },[])
  return (
    <div className={`flex-1 my-3 h-screen ${isDark ? 'bg-[#151515]' : 'bg-white'} flex flex-col items-center`}>
      {
        posts?.map((post) => <Post key={post._id} post={post} />)
      }
    </div>
  )
}

export default Posts