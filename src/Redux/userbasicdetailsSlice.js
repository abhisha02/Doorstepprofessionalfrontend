import {createSlice} from '@reduxjs/toolkit'


export const userBasicDetailsSlice = createSlice(
   {
    name: 'user_basic_details',
    initialState: {
      name: null,
      profile_pic:null,
      userId:null,
      isProfessional:false
    
    },
    reducers: {
      set_user_basic_details: (state, action) => {
        state.name = action.payload.name;
        state.profile_pic = action.payload.profile_pic;
        state.userId=action.payload.userId;
        state.isProfessional=action.payload.isProfessional
       
      },
    
    }


})

export const {set_user_basic_details} =  userBasicDetailsSlice.actions

export default userBasicDetailsSlice.reducer