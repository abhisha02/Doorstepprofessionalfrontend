import React, { useEffect } from "react";
import { Routes, Route,useLocation } from "react-router-dom";

import PrivateRoute from "../PrivateRoute";
import isAuthUser from "../../utils/isAuthUser";
import { useDispatch,useSelector } from 'react-redux';
import { set_Authentication } from "../../Redux/userauthenticationSlice"; 
import { set_user_basic_details } from "../../Redux/userbasicdetailsSlice"; 
import axios from 'axios'
import CustomerRegister from '../../pages/customer/CustomerRegister';
import OTPVerification from '../../pages/customer/Customerotp';
import UserLogin from '../../pages/customer/customerlogin';
import Customerhome from "../../pages/customer/Customerhome";
import FooterBar from "./customerfooter";
import HeaderBar from "./customerHeader";
import CustomerProfile from "../../pages/customer/CustomerProfile";
import CustomerEdit from "../../pages/customer/CustomerEdit";
import CustomerAccount from "../../pages/customer/CustomerAccount";
import Servicedetailed from "../../pages/customer/Servicedetailed";
import Cart from "../../pages/customer/Cart";
import Checkout from "../../pages/customer/Checkout";
import Addresses from "../../pages/customer/Addresses";
import SlotSelection from "../../pages/customer/SlotSelection";
import BookingConfirmation from "../../pages/customer/BookingConfirmation";
import Reschedule from "../../pages/customer/Reschedule";
import OtpVerificationEmailEdit from "../../pages/customer/OTPemailedit";
import EditEmail from "../../pages/customer/Editemail";
import ForgotPasswordRequest from "../../pages/customer/ForgotPasswordRequest";
import OTPforgotpassword from "../../pages/customer/OTPforgotpassword";
import Newpasswordset from "../../pages/customer/Newpasswordset";
import CategoryPage from "../../pages/customer/CategoryPage";
import Review from "../../pages/customer/Review";
import ServiceHistory from "../../pages/customer/ServiceHistory";
import ManageAddress from "../../pages/customer/ManageAddress";
import Favourites from "../../pages/customer/Favourites";
import ChatCustomer from "../../pages/customer/ChatCustomer";
import ProtectedRouteCustomer from "../ProtectedRouteCustomer";




function UserWrapper() {
  const dispatch = useDispatch();

  const authentication_user = useSelector(state => state.authentication_user)
  const location = useLocation(); 
  const checkAuth = async () => {
    const isAuthenticated = await isAuthUser();
    dispatch(
      set_Authentication({
        name: isAuthenticated.name,
        isAuthenticated: isAuthenticated.isAuthenticated
      })
    );

  };

  const baseURL='https://doorsteppro.shop'
  const token = localStorage.getItem('access');
  const fetchUserData = async () => {
    try {
        // const res = await axios.post(baseURL+'/api/accounts/user/details/',{headers: {Authorization: `Bearer ${token}`}})
        const res = await axios.get(baseURL+'/user/details/',{headers: {
          'authorization': `Bearer ${token}`,
          'Accept' : 'application/json',
          'Content-Type': 'application/json'
      }})
        .then(res => {
            console.log(res.data.is_professional)
            dispatch(
              set_user_basic_details({
                name : res.data.first_name,
                profile_pic : res.data.profile_pic,
                userId:res.data.id,
                isProfessional:res.data.is_professional
              })
            );
          })
    }
    catch (error) {
      console.log(error);
      
    }

  };
  useEffect(() => {
    if(!authentication_user.name)
    {
      checkAuth();
    
    }
    if(authentication_user.isAuthenticated)
    {
      fetchUserData();
    }

  }, [authentication_user])
  

  return (
    <>
     {(location.pathname!== "/customer/new-password-set" &&location.pathname!== "/customer/otp-forgotpassword" &&location.pathname!== "/customer/forgotpassword-request" &&location.pathname!== "/customer/register" && location.pathname!== "/customer/login"&&location.pathname!== "/customer/otp") && <HeaderBar />}

      <Routes>
      <Route path="register" element={< ProtectedRouteCustomer><CustomerRegister /></ProtectedRouteCustomer>} />
        <Route path="otp" element={<OTPVerification />} />
        <Route path="login" element={< ProtectedRouteCustomer><UserLogin /></ProtectedRouteCustomer>} />
        <Route path="home" element={ <PrivateRoute><Customerhome /></PrivateRoute>} />
        <Route path="my-profile" element={ <PrivateRoute>< CustomerProfile /></PrivateRoute>} />
        <Route path="edit" element={ <PrivateRoute>< CustomerEdit /></PrivateRoute>} />
        <Route path="account" element={ <PrivateRoute>< CustomerAccount /></PrivateRoute>} />
        <Route path="/services/:id" element={ <PrivateRoute>< Servicedetailed /></PrivateRoute>} />
        <Route path="cart" element={ <PrivateRoute>< Cart/></PrivateRoute>} />
        <Route path="checkout" element={ <PrivateRoute>< Checkout/></PrivateRoute>} />
        <Route path="addresses" element={ <PrivateRoute>< Addresses/></PrivateRoute>} />
        <Route path="slots" element={ <PrivateRoute>< SlotSelection/></PrivateRoute>} />
        <Route path="bookingconfirmation" element={ <PrivateRoute>< BookingConfirmation/></PrivateRoute>} />
        <Route path="reschedule" element={ <PrivateRoute>< Reschedule/></PrivateRoute>} />
        <Route path="otpeditemail" element={ <PrivateRoute>< OtpVerificationEmailEdit/></PrivateRoute>} />
        <Route path="emailedit" element={ <PrivateRoute><EditEmail/></PrivateRoute>} />
        <Route path="forgotpassword-request" element={ <ForgotPasswordRequest/>} />
        <Route path="otp-forgotpassword" element={ <OTPforgotpassword/>} />
        <Route path="new-password-set" element={<Newpasswordset/>} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="reviews-and-ratings" element={<PrivateRoute><Review /></PrivateRoute>} />
        <Route path="service-history" element={<PrivateRoute><ServiceHistory /></PrivateRoute>} />
        <Route path="manage-address" element={<PrivateRoute><ManageAddress /></PrivateRoute>} />
        <Route path="favourites" element={<PrivateRoute><Favourites /></PrivateRoute>} />
        <Route path="chat-customer" element={<PrivateRoute><ChatCustomer /></PrivateRoute>} />
        
        
        </Routes>    
   
        <div style={{ height: '300px' }}></div>
     
    <FooterBar />
    </>
  );
}

export default UserWrapper;