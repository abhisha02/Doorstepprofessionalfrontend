import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import FooterBar from "./adminfooter";
import AdHeaderBar from "./adminheader";

import AdminLogin from '../../pages/Admin/Adminlogin';
import PrivateRoute from '../PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { set_user_basic_details } from '../../Redux/userbasicdetailsSlice';
import axios from 'axios';
import isAuthAdmin from '../../utils/isAuthAdmin';
import Adminhome from '../../pages/Admin/Adminhome';
import AdminCustomers from '../../pages/Admin/AdminCustomers';
import AdminUpdateUser from '../../pages/Admin/AdminUpdateUser';
import AdminCreateUser from '../../pages/Admin/AdminCreateuser';
import AdminProfessionals from '../../pages/Admin/AdminProfessionals';
import AdminUpdatePro from '../../pages/Admin/AdminUpdatePro';
import AdminCreatePro from '../../pages/Admin/AdminCreatePro';
import Adminprofile from '../../pages/Admin/Adminprofile';
import Adminprofileedit from '../../pages/Admin/Adminprofileedit';
import AdminProApproval from '../../pages/Admin/AdminProApproval';
import AdminProapproval2 from '../../pages/Admin/AdminProapproval2';
import AdminCategories from '../../pages/Admin/AdminCategories';
import AdminCreateCategory from '../../pages/Admin/AdminCreateCategory';
import AdminUpdateCategory from '../../pages/Admin/AdminUpdateCategory';
import AdminServices from '../../pages/Admin/AdminServices';
import AdminCreateServices from '../../pages/Admin/AdminCreateServices';
import AdminupdateServices from '../../pages/Admin/AdminupdateServices';
import AdminBookings from '../../pages/Admin/AdminBookings';
import ProtectedRouteAdmin from '../ProtectedRouteAdmin';

function AdminWrapper() {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const location = useLocation(); 

  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  const checkAuthAndFetchUserData = async () => {
    try {
      const isAuthenticated = await isAuthAdmin();
      dispatch(
        set_Authentication({
          name: isAuthenticated.name,
          isAuthenticated: isAuthenticated.isAuthenticated,
          isAdmin: isAuthenticated.isAdmin,
        })
      );
  
      if (isAuthenticated.isAuthenticated) {
        const token = localStorage.getItem('access');
        const res = await axios.get(baseURL + '/user/details/', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
  
        dispatch(
          set_user_basic_details({
            name: res.data.first_name,
          })
        );
      }
    } catch (error) {
      console.error("Error in checkAuthAndFetchUserData:", error);
    }
  };
  

  useEffect(() => {
    checkAuthAndFetchUserData();
  }, [location]);

  return (
    <>
      {(location.pathname !== "/admin/login") && <AdHeaderBar />}
      
      <Routes>
        <Route path="login" element={<ProtectedRouteAdmin ><AdminLogin /></ProtectedRouteAdmin>} />
        <Route path="home" element={<PrivateRoute><Adminhome /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><Adminprofile/></PrivateRoute>} />
        <Route path="edit" element={<PrivateRoute><Adminprofileedit/></PrivateRoute>} />
        <Route path="customers" element={<PrivateRoute><AdminCustomers/></PrivateRoute>} />
        <Route path="customers/update/:id" element={<PrivateRoute><AdminUpdateUser /></PrivateRoute>} />
        <Route path="customers/user/create" element={<PrivateRoute><AdminCreateUser /></PrivateRoute>} />
        <Route path="professionals" element={<PrivateRoute><AdminProfessionals/></PrivateRoute>} />
        <Route path="professionals/update/:id" element={<PrivateRoute><AdminUpdatePro /></PrivateRoute>} />
        <Route path="professionals/user/create" element={<PrivateRoute><AdminCreatePro /></PrivateRoute>} />
        <Route path="approval-submission" element={<PrivateRoute><AdminProApproval /></PrivateRoute>} />
        <Route path="approval-submission/:id" element={<PrivateRoute><AdminProapproval2 /></PrivateRoute>} />
        <Route path="category" element={<PrivateRoute><AdminCategories/></PrivateRoute>} />
        <Route path="category/create" element={<PrivateRoute><AdminCreateCategory /></PrivateRoute>} />
        <Route path="category/update/:id" element={<PrivateRoute><AdminUpdateCategory /></PrivateRoute>} />
        <Route path="services" element={<PrivateRoute><AdminServices/></PrivateRoute>} />
        <Route path="services/create" element={<PrivateRoute><AdminCreateServices /></PrivateRoute>} />
        <Route path="services/update/:id" element={<PrivateRoute><AdminupdateServices /></PrivateRoute>} />
        <Route path="bookings" element={<PrivateRoute><AdminBookings /></PrivateRoute>} />
      
      
      
      </Routes>
      
      <div style={{ height: '300px' }}></div>
      <FooterBar />
    </>
  );
}

export default AdminWrapper;
