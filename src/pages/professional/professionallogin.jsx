import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { jwtDecode } from 'jwt-decode';
import HeaderBar from './headernologin';
import happyc from './happycleaners.jpg';

function ProUserLogin() {
  const { state } = useLocation();
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState([]);
  const [approvalMessage, setApprovalMessage] = useState(null);
  const [showError, setShowError] = useState(false);
  const [blockMessage, setBlockMessage] = useState(null); // State for block message
  const baseURL = 'https://doorsteppro.shop';

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (state && state.resetMessage) {
      setMessage(state.resetMessage);
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setFormError([]);
    setApprovalMessage(null);

    const formData = new FormData();
    formData.append('email', event.target.email.value);
    formData.append('password', event.target.password.value);

    try {
      const res = await axios.post(baseURL + '/login/', formData);

      if (res.status === 200) {
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);

        const isProfessional = res.data.isProfessional;
        const isApproved = res.data.isApproved;
        const isRejected=res.data.isRejected;
        if (!res.data.isProfessional) {
          setFormError(['Invalid credentials']);
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 5000);
          return;
        }
        if (isRejected) {
          setApprovalMessage('Your account creation request has been declined by the administrator.');
          setTimeout(() => {
            setApprovalMessage(null);
          }, 5000);
          return;
        }

        if (!isApproved) {
          setApprovalMessage('Your account has not yet received approval from the admin.');
          setTimeout(() => {
            setApprovalMessage(null);
          }, 5000);
          return;
        }

        const authData = {
          name: jwtDecode(res.data.access).first_name,
          isAuthenticated: true,
          isAdmin: res.data.isAdmin,
          isProfessional: res.data.isProfessional,
        };

        dispatch(set_Authentication(authData));

        if (isProfessional) {
          navigate('/professional/home');
        } else {
          setFormError(['Invalid credentials.']);
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 5000);
        }

        return res;
      }
    } catch (error) {
      console.error('Error during login:', error);

      if (error.response && error.response.status === 403) {
        setBlockMessage('You have been temporarily blocked by admin');
        setTimeout(() => {
          setBlockMessage(null); // Hide block message after 5 seconds
        }, 5000);
      } else if (error.response && error.response.status === 401) {
        setFormError(['Invalid credentials.']);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      } else {
        setFormError(['An unexpected error occurred.']);
      }
    }
  };

  return (
    <section>
      <HeaderBar />
      <div className="container py-5">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-md-8 col-lg-7 col-xl-6">
            {message && (
              <div className="alert alert-primary" role="alert">
                {message}
              </div>
            )}

            <img 
              src={happyc} 
              className="img-fluid" 
              alt="Happy Cleaners" 
              style={{ maxWidth: '100%', height: 'auto', marginTop: '20px' }} // Adjust margin-top value as needed
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form method="POST" onSubmit={handleLoginSubmit}>
              {/* Email input */}
              <div className="mb-4">
                <label className="form-label" htmlFor="form1Example13">
                  Email address
                </label>
                <input type="email" name="email" id="form1Example13" className="form-control form-control-lg" />
              </div>

              {/* Password input */}
              <div className="mb-4">
                <label className="form-label" htmlFor="form1Example23">
                  Password
                </label>
                <input type="password" name="password" id="form1Example23" className="form-control form-control-lg" />
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                className="btn btn-dark btn-lg btn-block" 
                style={{ width: '100%', marginTop: '10px' }}
              >
                Sign in
              </button>
              <div className="mt-3 text-center">
                <Link to="/professional/register" className="text-dark">
                  Register
                </Link>
              </div>
              <div className="mt-3 text-center">
                <Link to="/customer/forgotpassword-request" className="text-dark">
                  Forgot Password
                </Link>
              </div>

              {/* Approval message display */}
              {approvalMessage && (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                  {approvalMessage}
                  <button 
                    type="button" 
                    className="btn-close" 
                    aria-label="Close" 
                    onClick={() => setApprovalMessage(null)}
                  ></button>
                </div>
              )}

              {/* Error message display */}
              {showError && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {formError[0]}
                  <button 
                    type="button" 
                    className="btn-close" 
                    aria-label="Close" 
                    onClick={() => setShowError(false)}
                  ></button>
                </div>
              )}

              {/* Block message display */}
              {blockMessage && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {blockMessage}
                  <button 
                    type="button" 
                    className="btn-close" 
                    aria-label="Close" 
                    onClick={() => setBlockMessage(null)}
                  ></button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProUserLogin;
