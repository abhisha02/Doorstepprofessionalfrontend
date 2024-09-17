import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import avatar from './avatar.jpeg';

function EditEmail() {
  const navigate = useNavigate();
  const authentication_user = useSelector(state => state.authentication_user);
  const baseURL = 'https://doorsteppro.shop';
  const token = localStorage.getItem('access');

  const [userDetails, setUserDetails] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${baseURL}/user/details/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setUserDetails(res.data);
      setEmail(res.data.email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [authentication_user]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post(`${baseURL}/send-email-update-otp/`, { email }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log("OTP sent successfully:", response.data);
      navigate('/customer/otpeditemail', { state: { email } });
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        setError(error.response.data.error || "An error occurred while sending OTP.");
      } else if (error.request) {
        console.error("Request data:", error.request);
        setError("No response received from the server.");
      } else {
        console.error("Error message:", error.message);
        setError(error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  return (
    <section className="" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img
                    src={userDetails?.profile ? `${baseURL}${userDetails.profile}` : avatar}
                    className="rounded-circle img-fluid"
                    style={{ maxWidth: '150px', height: 'auto' }}
                    alt='Profile'
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your new email here"
                  value={email}
                  onChange={handleEmailChange}
                  className='form-control my-2'
                />
                <button onClick={sendOtp} className="btn btn-dark btn-rounded btn-lg">Send OTP</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditEmail;
