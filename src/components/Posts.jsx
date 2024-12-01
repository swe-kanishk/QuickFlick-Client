import React, { useEffect, useState, useRef } from 'react';
import Post from './Post';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, appendPosts } from '@/redux/postSlice';
import axios from 'axios';
import { Loader, Loader2, Loader2Icon } from 'lucide-react'; // Import Loader2 from lucide-react
import { toast } from "sonner";
import Stories from './Stories';
import CreateStories from './CreateStories';

function Posts() {
  const { posts } = useSelector((store) => store.post);
  const { isDark, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const endReachedToast = useRef(false); // Track whether end toast has been shown

  // Fetch posts function
  const fetchPosts = async (currentPage) => {
    console.log('Fetching page:', currentPage); // Debugging
    if (loading) return; // Prevent multiple requests
    setLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/post/all`, {
        params: { page: currentPage, limit: 5 },
        withCredentials: true,
      });

      console.log('Full API Response:', response);

      if (response.data?.success) {
        const newPosts = response.data.posts;
        if (newPosts.length > 0) {
          if (currentPage === 1) {
            dispatch(setPosts(newPosts));
          } else {
            dispatch(appendPosts(newPosts));
          }
        } else {
          setHasMore(false);
          console.log('No more posts available');
        }
      } else {
        console.error('API did not return success:', response.data);
        toast.error(response.data?.message || 'Failed to fetch posts');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status outside the 2xx range
        console.error('Server error:', error.response);
        toast.error(error.response.data?.message || 'Server error occurred');
      } else if (error.request) {
        // Request was made but no response was received
        console.error('No response received:', error.request);
        toast.error('No response from server. Please try again.');
      } else {
        // Other errors (e.g., request setup, unexpected issues)
        console.error('Error setting up the request:', error.message);
        toast.error('Unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts when the page changes
  useEffect(() => {
    console.log('Page changed to:', page); // Debug log for page change
    fetchPosts(page);
  }, [page]);

  // IntersectionObserver to load more posts when scrolled to the bottom
  const lastPostRef = (node) => {
    if (loading) return; // Prevent observation while loading
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        console.log('Observer entries:', entries); // Debug log
        if (entries[0].isIntersecting) {
          if (hasMore) {
            console.log('Last post is visible, loading next page...');
            setPage((prevPage) => prevPage + 1); // Fetch next page
          } else {
            if (!endReachedToast.current) {
              toast.info('You have reached the end of the posts');
              endReachedToast.current = true; // Ensure toast is only shown once
            }
          }
        }
      },
      {
        root: null, // Default viewport
        rootMargin: '200px', // Trigger when last post is 200px from the viewport
        threshold: 0.99, // Trigger when 99% of the element is visible
      }
    );

    if (node) {
      observer.current.observe(node); // Observe the last post
    }
  };

  return (
    <div
      className={`flex-1 gap-1 h-screen  ${
        isDark ? 'bg-[#151515]' : 'bg-white'
      } flex flex-col items-center overflow-auto`}
    >
      <div className='w-full md:flex flex-start py-2 hidden'>
      <Stories />
      <CreateStories user={user} />
      </div>
      {/* Render posts */}
      {posts?.map((post, index) => (
        <div
        className='w-full'
          key={post._id}
          ref={index === posts.length - 1 ? lastPostRef : null} // Last post observation
        >
          <Post post={post} />
        </div>
      ))}

      {/* Loading spinner while fetching data */}
      {loading && hasMore && (
        <div className={`${isDark ?  "text-white" : "text-black"} flex justify-center items-center py-4`}>
          <Loader className={`animate-spin mx-auto`} size={24} />
          <p className="ml-2">Loading more posts...</p>
        </div>
      )}
    </div>
  );
}

export default Posts;