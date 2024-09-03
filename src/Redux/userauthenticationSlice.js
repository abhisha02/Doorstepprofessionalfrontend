import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authentication_user',
  initialState: {
    userId: null, // Add userId field to store the user ID
    name: null,
    isAuthenticated: false,
    isAdmin: false,
    isProfessional:false
  
  },
  reducers: {
    set_Authentication: (state, action) => {
      state.userId = action.payload.userId; // Set userId when user logs in
      state.name = action.payload.name;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.isAdmin;
      state.isProfessional=action.payload.isProfessional;
  
    },
  
  },
});

export const { set_Authentication } = authenticationSlice.actions;

export default authenticationSlice.reducer;