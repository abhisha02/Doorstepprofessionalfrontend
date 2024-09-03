import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function ForgotPasswordRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/password-reset-request/', { email });
      setMessage(response.data.message);
      navigate('/customer/otp-forgotpassword'); // Navigate to OTP verification page
    } catch (error) {
      setError(error.response?.data.error || 'An error occurred');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 pt-5">
      <div className="text-center" style={{ maxWidth: '600px', width: '100%' }}>
        <h4>Enter your email below to reset your password.</h4>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-5">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-dark rounded-pill px-4 py-2">Send OTP</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordRequest;
