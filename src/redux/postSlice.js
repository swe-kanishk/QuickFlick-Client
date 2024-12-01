import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: null,
    selectedPost: null,
    hasMore: true,
  },
  reducers: {
    // Reset posts (used for initial page or refreshing the list)
    setPosts: (state, action) => {
      console.log('Resetting posts:', action.payload); // Debug log
      state.posts = action.payload;
    },

    // Append new posts to the existing posts
    appendPosts: (state, action) => {
        if(action.payload){
            state.posts = [...state.posts, ...action.payload];
        }else {
            console.log('action ka koi payload hai hi nhi')
        }
    },
      

    // Set whether more posts exist
    setHasMore: (state, action) => {
        console.log(state.posts)
      state.hasMore = action.payload;
    },

    // Set a selected post (e.g., for a detailed view)
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
  },
});

export const { setPosts, appendPosts, setHasMore, setSelectedPost } =
  postSlice.actions;

export default postSlice.reducer;