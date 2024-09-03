import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  professionalData: null,
  availableServices: [],
  currentBookings: [],
  serviceRequests: [],
  activeAssignments: [],
};

const professionalSlice = createSlice({
  name: 'professional',
  initialState,
  reducers: {
    setProfessionalData: (state, action) => {
      state.professionalData = action.payload;
    },
    clearProfessionalData: (state) => {
      state.professionalData = null;
    },
    updateAvailableServices: (state, action) => {
      state.availableServices = action.payload;
    },
    addBooking: (state, action) => {
      state.currentBookings.push(action.payload);
    },
    removeBooking: (state, action) => {
      state.currentBookings = state.currentBookings.filter(
        booking => booking.id !== action.payload
      );
    },
    updateBookingStatus: (state, action) => {
      const index = state.currentBookings.findIndex(
        booking => booking.id === action.payload.id
      );
      if (index !== -1) {
        state.currentBookings[index].status = action.payload.status;
      }
    },
    // Add these new reducers
    updateServiceRequests: (state, action) => {
      state.serviceRequests = action.payload;
    },
    updateActiveAssignments: (state, action) => {
      state.activeAssignments = action.payload;
    },
  },
});

export const { 
  setProfessionalData, 
  clearProfessionalData, 
  updateAvailableServices, 
  addBooking, 
  removeBooking, 
  updateBookingStatus,
  updateServiceRequests,  // Export the new action
  updateActiveAssignments  // Export the new action
} = professionalSlice.actions;

export default professionalSlice.reducer;