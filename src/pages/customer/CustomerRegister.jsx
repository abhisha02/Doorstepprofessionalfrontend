import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderBar from './headernologin';
import registercustomer from './registercustomer.avif';

function UserRegister() {
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();
  const baseURL = 'https://doorsteppro.shop';

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setFormError({});

    const formData = {
      first_name: event.target.first_name.value,
      last_name: event.target.last_name.value,
      email: event.target.email.value,
      password: event.target.password.value,
      phone_number: event.target.phone_number.value,
    };

    // Client-side validation
    if (formData.password.length < 8) {
      setFormError({ password: 'Password must be at least 8 characters long' });
      return;
    }

    if (formData.phone_number.length < 10) {
      setFormError({ phone_number: 'Mobile number must be at least 10 characters long' });
      return;
    }

    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError({ email: 'Invalid email format' });
      return;
    }

    try {
      const res = await axios.post(baseURL + '/register2/', formData);
      if (res.status === 200) {
        navigate('/customer/otp', {
          state: { user: formData.first_name }
        });
        return res;
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        setFormError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <section style={{ backgroundColor: "white", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <HeaderBar />
      <div className="container py-5">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-md-5 d-flex justify-content-center mb-4 mb-md-0">
            <img src={registercustomer} alt="Registration Image" className="img-fluid" style={{ maxHeight: '400px', maxWidth: '100%' }} />
          </div>
          <div className="col-md-7">
            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
              <div className="card-body d-flex flex-column justify-content-center p-4 p-md-5">
                <h3 className="mb-4 text-center">Register Now</h3>
                <form onSubmit={handleRegisterSubmit} className="text-center">
                  <div className="mb-3">
                    <label htmlFor="first_name" className="form-label visually-hidden">First Name</label>
                    <input type="text" id="first_name" name="first_name" className="form-control form-control-lg" required placeholder="First Name" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="last_name" className="form-label visually-hidden">Last Name</label>
                    <input type="text" id="last_name" name="last_name" className="form-control form-control-lg" required placeholder="Last Name" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label visually-hidden">Email</label>
                    <input type="email" id="email" name="email" className="form-control form-control-lg" required placeholder="Email" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone_number" className="form-label visually-hidden">Mobile Number</label>
                    <input type="text" id="phone_number" name="phone_number" className="form-control form-control-lg" required placeholder="Mobile Number" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label visually-hidden">Password</label>
                    <input type="password" id="password" name="password" className="form-control form-control-lg" required placeholder="Password" />
                  </div>
                  <button type="submit" className="btn btn-dark btn-lg w-100 mt-3">Register Now</button>
                </form>
                <ul className='text-danger mt-3'>
                  {Object.keys(formError).map((field, index) => (
                    <li key={index}>{formError[field]}</li>
                  ))}
                </ul>
                <p className="text-center mt-3">
                  Already have an account? <Link to='/customer/login' className="text-dark">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserRegister;
