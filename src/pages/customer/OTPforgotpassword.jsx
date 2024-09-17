import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function OTPforgotpassword() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post('https://doorsteppro.shop/reset-password/verify-otp/', { otp });
      setMessage(response.data.message);
      
      // Store OTP in local storage
      localStorage.setItem('otp', otp);

      // Navigate to password reset page
      navigate('/customer/new-password-set');
    } catch (error) {
      setError(error.response?.data.error || 'An error occurred');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 pt-5">
      <div className="text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Verify OTP</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-5">
            <label htmlFor="otp" className="form-label">OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-dark rounded-pill px-4 py-2">Verify OTP</button>
        </form>
      </div>
    </div>
  );
}

export default OTPforgotpassword;
