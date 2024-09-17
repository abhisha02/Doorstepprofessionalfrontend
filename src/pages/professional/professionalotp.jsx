import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function ProOTPVerification() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const baseURL = 'https://doorsteppro.shop';

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const formData = {
      otp: otp,
      user: location.state.user,  // Ensure this matches the state passed from UserRegister
    };

    try {
      const res = await axios.post(baseURL + '/otp-verification/', formData);
      if (res.status === 200) {
        navigate('/professional/login', {
          state: { message: 'Thank you for submitting your request to join our community. Access will be granted upon administrator approval' },
        });
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <section style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5">
                <h3 className="mb-5 text-center">OTP Verification</h3>
                <form onSubmit={handleOtpSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Enter OTP</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      required
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-dark btn-lg"
                      style={{ color: 'white' }}
                    >
                      Verify OTP
                    </button>
                  </div>
                </form>
                {error && <p className="text-danger mt-3">{error}</p>}
                <hr className="my-4" />
                <p className="text-center">
                  <Link to="/professional/register/" className="text-dark">Back to Register</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProOTPVerification;
