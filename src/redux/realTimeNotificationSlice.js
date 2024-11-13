import { createSlice } from "@reduxjs/toolkit";

const realTimeNotificationSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    allNotifications: [],         // Stores all fetched notifications
    realTimeNotifications: [],     // Stores real-time notifications after the last read
    unreadCount: 0,                // Tracks unread notifications count
  },
  reducers: {
    addNotification: (state, action) => {
      const newNotification = action.payload;
      
      // Add to real-time notifications and increment count if unread
      state.realTimeNotifications.unshift(newNotification);
      state.unreadCount += 1;
    },
    setAllNotifications: (state, action) => {
      // Set all notifications from a fetched array (e.g., from backend)
      state.allNotifications = action.payload;
      state.realTimeNotifications = [];
      state.unreadCount = 0;
    },
    allRead: (state) => {
      // Mark all notifications as read
      state.allNotifications.forEach((notif) => (notif.isRead = true));

      // Clear real-time notifications and reset count
      state.realTimeNotifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, setAllNotifications, allRead } = realTimeNotificationSlice.actions;
export default realTimeNotificationSlice.reducer;
