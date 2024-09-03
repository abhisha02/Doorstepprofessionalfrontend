
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function OtpVerificationEmailEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const verifyOtpAndUpdateEmail = async () => {
    try {
      const response = await axios.post(`${baseURL}/verify-email-update-otp/`, { email, otp }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log("Email updated successfully:", response.data);
      navigate('/customer/my-profile');  // Redirect to profile or another appropriate page
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        setError(error.response.data.error || "An error occurred while verifying OTP.");
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
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  className='form-control my-2'
                />
                <button onClick={verifyOtpAndUpdateEmail} className="btn btn-dark btn-rounded btn-lg">Verify OTP and Update Email</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OtpVerificationEmailEdit;
