import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderBar from './headernologin';
import proregster from './proregster.png';

function ProfessionalRegister() {
  const [formError, setFormError] = useState({});
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const baseURL = 'http://127.0.0.1:8000';
 

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/services/categories/`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setFormError({});

    const formData = {
      first_name: event.target.first_name.value,
      email: event.target.email.value,
      password: event.target.password.value,
      phone_number: event.target.phone_number.value,
      job_profile: {
        gender: event.target.gender.value,
        address: event.target.address.value,
        profession: event.target.profession.value, // This will be the selected category ID
        address_pincode: event.target.address_pin.value,
        years_of_exp: event.target.years_of_exp.value,
        adhar_no: event.target.adhar_no.value
      }
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError({ email: 'Invalid email format' });
      return;
    }

    try {
      const res = await axios.post(baseURL + '/register2/', formData);
      if (res.status === 200) {
        navigate('/professional/otp', {
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
        <div className="row">
          <div className="col-md-5 d-flex justify-content-center align-items-center mb-4 mb-md-0">
            <img src={proregster} alt="Registration Image" className="img-fluid" style={{ maxHeight: '400px', maxWidth: '100%' }} />
          </div>
          <div className="col-md-7 d-flex justify-content-center align-items-center">
            <div className="card shadow-2-strong" style={{ borderRadius: '1rem', maxWidth: '600px', width: '100%', height: 'auto' }}>
              <div className="card-body d-flex flex-column justify-content-center">
                <h3 className="mb-4 text-center">Register Now</h3>
                <form onSubmit={handleRegisterSubmit} className="text-center">
                  <div className="mb-3">
                    <label htmlFor="first_name" className="form-label visually-hidden">Name</label>
                    <input type="text" id="first_name" name="first_name" className="form-control form-control-lg" required placeholder="Name" />
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
                    <label htmlFor="gender" className="form-label visually-hidden">Gender</label>
                    <input type="text" id="gender" name="gender" className="form-control form-control-lg" required placeholder="Gender" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profession" className="form-label visually-hidden">Profession</label>
                    <select id="profession" name="profession" className="form-control form-control-lg" required>
                      <option value="">Select a profession</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label visually-hidden">Address</label>
                    <input type="text" id="address" name="address" className="form-control form-control-lg" required placeholder="Address" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address_pin" className="form-label visually-hidden">Address PIN</label>
                    <input type="text" id="address_pin" name="address_pin" className="form-control form-control-lg" required placeholder="Address PIN" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="years_of_exp" className="form-label visually-hidden">Years of experience</label>
                    <input type="text" id="years_of_exp" name="years_of_exp" className="form-control form-control-lg" required placeholder="Years of experience" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="adhar_no" className="form-label visually-hidden">Aadhar Number</label>
                    <input type="text" id="adhar_no" name="adhar_no" className="form-control form-control-lg" required placeholder="Aadhar Number" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label visually-hidden">Password</label>
                    <input type="password" id="password" name="password" className="form-control form-control-lg" required placeholder="Password" />
                  </div>
                  <button  className="btn btn-dark btn-lg w-100" type="submit">Register</button>
                  <hr className="my-4" />
                  <div className="d-flex justify-content-center align-items-center">
                    <p className="text-center">Already have an account? <Link to="/login">Login</Link></p>
                  </div>
                </form>
                {formError.phone_number && <p className="text-danger text-center">{formError.phone_number}</p>}
                {formError.password && <p className="text-danger text-center">{formError.password}</p>}
                {formError.email && <p className="text-danger text-center">{formError.email}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfessionalRegister;
