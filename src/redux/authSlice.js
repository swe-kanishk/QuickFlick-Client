import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isOtpExpired: false,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setIsOtpExpired: (state, action) => {
            state.isOtpExpired = action.payload
        },
    }
})

export const { 
    setAuthUser, 
    setSuggestedUsers, 
    setUserProfile,
    setSelectedUser ,
    setIsOtpExpired
} = authSlice.actions;
export default authSlice.reducer;