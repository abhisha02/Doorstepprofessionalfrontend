import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function Newpasswordset() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Retrieve OTP from local storage
    const otp = localStorage.getItem('otp');

    try {
      const response = await axios.post('http://127.0.0.1:8000/reset-password/', { otp, new_password: newPassword });
      const { message, is_professional } = response.data;
      
      // Remove OTP from local storage
      localStorage.removeItem('otp');

      // Redirect to the appropriate login page with the message
      setTimeout(() => {
        if (is_professional) {
          navigate('/professional/login', { state: { resetMessage: message } });
        } else {
          navigate('/customer/login', { state: { resetMessage: message } });
        }
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      setError(error.response?.data.error || 'An error occurred');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 pt-5">
      <div className="text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="newPassword" className="form-label">New Password:</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-dark rounded-pill px-4 py-2">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default Newpasswordset;
