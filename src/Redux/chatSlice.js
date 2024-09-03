
// src/Redux/newMessageSlice.js

import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'newMessages',
  initialState: {
    hasNewMessages: false,
    isChatOpen: false,
    bookingsWithNewMessages: []
  },
  reducers: {
    updateNewMessageIndicator: (state, action) => {
      state.hasNewMessages = true;
      if (!state.bookingsWithNewMessages.includes(action.payload)) {
        state.bookingsWithNewMessages.push(action.payload);
      }
    },
    setChatOpen: (state, action) => {
      state.isChatOpen = action.payload;
    },
    clearNewMessageIndicator: (state, action) => {
      state.bookingsWithNewMessages = state.bookingsWithNewMessages.filter(id => id !== action.payload);
      state.hasNewMessages = state.bookingsWithNewMessages.length > 0;
    }
  }
});

export const { updateNewMessageIndicator, clearNewMessageIndicator,setChatOpen } = chatSlice.actions;
export default chatSlice.reducer;