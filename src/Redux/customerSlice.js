import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerData: null,
  accountUpdates: false,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    updateCustomerAccount: (state, action) => {
      state.customerData = action.payload;
      state.accountUpdates = true;
    },
    clearAccountUpdates: (state) => {
      state.accountUpdates = false;
    },
    setCustomerData: (state, action) => {
      state.customerData = action.payload;
    },
    clearCustomerData: (state) => {
      state.customerData = null;
    },
  },
});

export const { 
  updateCustomerAccount, 
  clearAccountUpdates, 
  setCustomerData, 
  clearCustomerData 
} = customerSlice.actions;

export default customerSlice.reducer;