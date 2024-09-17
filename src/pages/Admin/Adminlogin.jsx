import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import HeaderBar from './headernologin';
import admin from './admin.jpg';

function AdminLogin() {
  const [formError, setFormError] = useState([]);
  const baseURL = 'https://doorsteppro.shop';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (formError.length > 0) {
      const timer = setTimeout(() => {
        setFormError([]);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [formError]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setFormError([]);
    const formData = new FormData();
    formData.append('email', event.target.email.value);
    formData.append('password', event.target.password.value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(event.target.email.value)) {
      setFormError([{ detail: 'Invalid Credentials' }]);
      return;
    }

    try {
      const res = await axios.post(baseURL + '/login/', formData);

      if (res && res.status === 200) {
        if (!res.data.isAdmin || res.data.isProfessional) {
          setFormError([{ detail: 'Invalid credentials' }]);
          return; // Make sure to return here to prevent further code execution
        }

        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);

        dispatch(
          set_Authentication({
            name: jwtDecode(res.data.access).first_name,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
            isProfessional: res.data.isProfessional,
          })
        );

        navigate('/admin/home'); // Redirect to admin home if isAdmin is true

        return res;
      }
    } catch (error) {
      console.error('Error during login:', error);

      if (error.response && error.response.status === 401) {
        setFormError([{ detail: 'Invalid Credentials' }]);
      } else {
        console.error('An unexpected error occurred:', error.message);
        setFormError([{ detail: 'Invalid Credentials' }]);
      }
    }
  };

  return (
    <section>
      <HeaderBar />
      <div className="container py-5">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-12 col-md-8 col-lg-7 col-xl-6">
            <img 
              src={admin} 
              className="img-fluid" 
              alt="Admin Login" 
              style={{ width: '100%', height: 'auto' }} 
            />
          </div>

          <div className="col-12 col-md-10 col-lg-5 col-xl-5 offset-lg-1">
            <form method="POST" onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="form-label" htmlFor="form1Example13">Email address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="form1Example13" 
                  className="form-control form-control-lg" 
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label" htmlFor="form1Example23">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  id="form1Example23" 
                  className="form-control form-control-lg" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-dark btn-lg btn-block" 
                style={{ width: '100%', marginTop: '10px' }}
              >
                Sign in
              </button>

              {formError.length > 0 && (
                <div className="alert alert-danger mt-3" role="alert">
                  {formError.map((error, index) => (
                    <div key={index}>{error.detail}</div>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;
