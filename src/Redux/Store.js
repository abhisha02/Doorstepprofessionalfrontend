import {configureStore} from '@reduxjs/toolkit'
import authenticationSliceReducer from './userauthenticationSlice'; // Adjust path as per your file structure
import userBasicDetailsSliceReducer from './userbasicdetailsSlice'; // Adjust path as
import chatSliceReducer from './chatSlice'


export default configureStore({
    reducer:{
        authentication_user:authenticationSliceReducer,
        user_basic_details:userBasicDetailsSliceReducer,
        newMessages:chatSliceReducer
    }
    
})