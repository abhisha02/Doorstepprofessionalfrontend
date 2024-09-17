import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import FooterBar from "./professionalfooter";
import ProHeaderBar from "./professionalheader";
import ProUserLogin from '../../pages/professional/professionallogin';
import PrivateRoute from '../PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { set_user_basic_details } from '../../Redux/userbasicdetailsSlice';
import axios from 'axios';
import isAuthProfessional from '../../utils/isAuthProfessional';
import Professionalhome from '../../pages/professional/professionalhome';
import ProOTPVerification from '../../pages/professional/professionalotp';
import ProfessionalRegister from '../../pages/professional/professionalregister';
import FooterBarPro from './professionalfooter';
import isAuthUser from "../../utils/isAuthUser";
import ProfessionalAccount from '../../pages/professional/professionalhome';
import ProfessionalProfile from '../../pages/professional/ProfessionalProfile';
import ProfessionalEdit from '../../pages/professional/ProfessionalEdit';
import ActiveTasks from '../../pages/professional/ActiveTasks';
import ProServiceHistory from '../../pages/professional/ProServiceHistory';
import Achievements from '../../pages/professional/Achievements';
import ServiceRequests from '../../pages/professional/ServiceRequests';
import ProtectedRoute from '../ProtectedRoute';


function ProfessionalWrapper() {
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
  

  const noHeaderPaths = ["/professional/register", "/professional/login", "/professional/otp"];



  return (
    <>
      {!noHeaderPaths.includes(location.pathname) && <ProHeaderBar />}
      
      <Routes>
        <Route path="register" element={<ProtectedRoute><ProfessionalRegister /></ProtectedRoute>}/>  
        <Route path="otp" element={<ProOTPVerification />} />
        <Route path="login" element={<ProtectedRoute><ProUserLogin /></ProtectedRoute>} />
        <Route path="home" element={<PrivateRoute><Professionalhome /></PrivateRoute>} />
        <Route path="account" element={<PrivateRoute><ProfessionalAccount /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><ProfessionalProfile /></PrivateRoute>} />
        <Route path="edit" element={<PrivateRoute><ProfessionalEdit /></PrivateRoute>} />
        <Route path="activetasks" element={<PrivateRoute><ActiveTasks /></PrivateRoute>} />
        <Route path="pro-service-history" element={<PrivateRoute><ProServiceHistory /></PrivateRoute>} />
        <Route path="achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
        <Route path="service-requests" element={<PrivateRoute><ServiceRequests /></PrivateRoute>} />
      </Routes>
      
      <div style={{ height: '300px' }}></div>
      <FooterBarPro />
    </>
  );
}

export default ProfessionalWrapper;
