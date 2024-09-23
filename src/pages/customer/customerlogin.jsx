import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { jwtDecode } from 'jwt-decode';
import HeaderBar from './headernologin';
import customerlogin from './customerlogin.png';
import { GoogleLogin } from '@react-oauth/google';

function UserLogin() {
  const { state } = useLocation();
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = 'https://doorsteppro.shop';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (state) {
      setMessage(state);
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  useEffect(() => {
    if (formError.length > 0) {
      const timer = setTimeout(() => {
        setFormError([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setFormError([]);
  
    const email = event.target.email.value;
    const password = event.target.password.value;
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setFormError(['Enter a valid email ID']);
      return;
    }
  
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
  
    try {
      const res = await axios.post(`${baseURL}/login/`, formData);
  
      if (res.status === 200) {
        console.log(jwtDecode(res.data.access).first_name);
      
        if (res.data.isAdmin || res.data.isProfessional) {
          setFormError(['Invalid credentials']);
          return;
        }
  
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        const decodedToken = jwtDecode(res.data.access);

        dispatch(
          set_Authentication({
            name: jwtDecode(res.data.access).first_name,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
            isProfessional: res.data.isProfessional,
            userId: jwtDecode(res.data.access).user_id,
          })
        );
        navigate('/customer/home');
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        setFormError(['Invalid credentials']);
      } else {
        setFormError(['You have been temporarily blocked by the admin']);
      }
    }
  };
  
  const handleGoogleLoginSuccess = async (response) => {
    setIsLoading(true);
    console.log('Google login response:', response);
    try {
      console.log('Sending credential:', response.credential);
      const res = await axios.post('https://doorsteppro.shop/auth/google/', {
        credential: response.credential
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Server response:', res);
      if (res.status === 200) {
        console.log(jwtDecode(res.data.access).first_name);
      
        if (res.data.isAdmin || res.data.isProfessional) {
          setFormError(['Invalid credentials']);
          setIsLoading(false);
          return;
        }
  
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        const decodedToken = jwtDecode(res.data.access);

        dispatch(
          set_Authentication({
            name: jwtDecode(res.data.access).first_name,
            isAuthenticated: true,
            isAdmin: res.data.isAdmin,
            isProfessional: res.data.isProfessional,
            userId: jwtDecode(res.data.access).user_id,
          })
        );
        navigate('/customer/home');
      }
    } catch (error) {
      console.error('Error during Google login:', error.response ? error.response.data : error);
      setFormError(['Failed to authenticate with the server. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderBar />
      <div className="container py-5 flex-grow-1">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-12 col-md-8 col-lg-7 col-xl-6 mb-4 mb-md-0">
            {message && (
              <div className="alert alert-primary" role="alert" data-mdb-color="dark">
                {message}
              </div>
            )}
            <img src={customerlogin} className="img-fluid" alt="Phone" />
          </div>
          <div className="col-12 col-md-7 col-lg-5 col-xl-5">
            <form method="POST" onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="form-label" htmlFor="form1Example13">
                  Email address
                </label>
                <input 
                  type="text" 
                  name="email" 
                  id="form1Example13" 
                  className="form-control form-control-lg" 
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label className="form-label" htmlFor="form1Example23">
                  Password
                </label>
                <input 
                  type="password" 
                  name="password" 
                  id="form1Example23" 
                  className="form-control form-control-lg" 
                  placeholder="Enter your password"
                />
              </div>
              {formError.length > 0 && (
                <div className="alert alert-danger" role="alert">
                  {formError.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              )}
              <button 
                type="submit" 
                className="btn btn-dark btn-lg btn-block" 
                style={{ width: '100%' }}
              >
                Sign in
              </button>
              <div className="mt-3 text-center">
                <Link to="/customer/register" className="text-dark">
                  Register
                </Link>
              </div>
              <div className="mt-3">
                {isLoading ? (
                  <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <GoogleLogin
                    clientId="988251266326-j5n9pjaoesumpoo5262g3bhva18ij3hr.apps.googleusercontent.com"
                    onSuccess={handleGoogleLoginSuccess}
                    onFailure={(error) => {
                      console.error('Google Login Error:', error);
                      setFormError(['Google login failed. Please try again.']);
                    }}
                    cookiePolicy={'single_host_origin'}
                    responseType='code'
                    accessType='offline'
                    scope='profile email'
                    disabled={isLoading}
                  />
                )}
              </div>
            </form>
            <div className="mt-3 text-center">
              <Link to="/customer/forgotpassword-request" className="text-dark">
                Forgot Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserLogin;