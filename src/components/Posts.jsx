import React, { useEffect } from 'react'
import Post from './Post'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice';

function Posts() {
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setPosts([]))
    }
  },[])
  return (
    <div className='flex-1 my-8 h-screen flex flex-col items-center'>
      {
        posts?.map((post) => <Post key={post._id} post={post} />)
      }
    </div>
  )
}

export default Posts
