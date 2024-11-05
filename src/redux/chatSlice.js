import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        onlineUsers: [],
        messages: [],
        unreadMessages: {},
    },
    reducers: {
        
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addUnreadMessage: (state, action) => {
            state.unreadMessages = state.unreadMessages || {};
            console.log(state.unreadMessages)
            const { userId } = action.payload;
            state.unreadMessages[`${userId}`] = (state.unreadMessages[`${userId}`] || 0) + 1;
        },
        markMessagesAsRead: (state, action) => {
            const { userId } = action.payload;
            state.unreadMessages[userId] = 0;
        }
    }
});

export const {setOnlineUsers, setMessages, addUnreadMessage, markMessagesAsRead} = chatSlice.actions;
export default chatSlice.reducer