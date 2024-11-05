import { createSlice } from "@reduxjs/toolkit";

const realTimeNotificationSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
    notificationUnreadCount: 0,
  },
  reducers: {
    setLikeNotification: (state, action) => {
      state.likeNotification = state.likeNotification || [];
      if (action.payload.type === "like") {
        state.likeNotification.unshift(action.payload);
        state.notificationUnreadCount += 1;
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter((item) => item.userId !== action.payload.userId || item.postId !== action.payload.postId);
      }
    },
    resetNotificationUnreadCount: (state) => {
      state.notificationUnreadCount = 0;
    },
  },
});

export const { setLikeNotification, resetNotificationUnreadCount } = realTimeNotificationSlice.actions;
export default realTimeNotificationSlice.reducer;
