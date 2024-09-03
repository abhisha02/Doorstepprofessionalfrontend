import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminCreatePro() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    profile: null,
    profession: '', // This will be the category ID
    gender: '',
    address: '',
    years_of_exp: '',
    adhar_no: ''
  });
  const [categories, setCategories] = useState([]);

  const baseURL = "http://127.0.0.1:8000";

  useEffect(() => {
    axios.get(`${baseURL}/services/categories/`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      profile: event.target.files[0],
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();

    // Append basic fields
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('phone_number', formData.phone_number);
    data.append('email', formData.email);
    data.append('password', formData.password);

    // Append profile picture
    if (formData.profile) {
      data.append('profile', formData.profile);
    }

    // Append job profile fields
    data.append('job_profile.gender', formData.gender);
    data.append('job_profile.address', formData.address);
    data.append('job_profile.profession', formData.profession); // Pass the category ID
    data.append('job_profile.years_of_exp', formData.years_of_exp);
    data.append('job_profile.adhar_no', formData.adhar_no);

    axios.post(`${baseURL}/aadmin/professionals/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(response => {
      navigate('/admin/professionals');
    })
    .catch(error => {
      console.error('Error creating professional:', error);
      if (error.response && error.response.status === 400) {
        setFormError(error.response.data);
      } else {
        console.log(error);
      }
    });
  };

  return (
    <section>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5">
                <h3 className="mb-5 text-center">Create New Professional</h3>
                <form onSubmit={handleSubmit} method='POST'>
                  {[
                    { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First Name' },
                    { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last Name' },
                    { label: 'Email', name: 'email', type: 'email', placeholder: 'Email' },
                    { label: 'Mobile Number', name: 'phone_number', type: 'text', placeholder: 'Phone Number' },
                    { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
                    { label: 'Profile Picture', name: 'profile', type: 'file' },
                    { label: 'Profession', name: 'profession', type: 'select', options: categories, placeholder: 'Select a profession' },
                    { label: 'Gender', name: 'gender', type: 'text', placeholder: 'Gender' },
                    { label: 'Address', name: 'address', type: 'text', placeholder: 'Address' },
                    { label: 'Years of Experience', name: 'years_of_exp', type: 'text', placeholder: 'Years of Experience' },
                    { label: 'Aadhar Number', name: 'adhar_no', type: 'text', placeholder: 'Aadhar Number' }
                  ].map(({ label, name, type, placeholder, options }, index) => (
                    <div className="mb-4" key={index}>
                      <label className="form-label">{label}</label>
                      {type === 'select' ? (
                        <select
                          name={name}
                          className="form-control form-control-lg"
                          required
                          onChange={handleInputChange}
                        >
                          <option value="">{placeholder}</option>
                          {options.map(option => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={type}
                          name={name}
                          className="form-control form-control-lg"
                          placeholder={placeholder}
                          onChange={type === 'file' ? handleFileChange : handleInputChange}
                        />
                      )}
                    </div>
                  ))}
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-dark btn-lg">Create Professional</button>
                  </div>
                  {formError.length > 0 && (
                    <div className="alert alert-danger mt-4">
                      {formError.map((error, index) => (
                        <div key={index}>{error.message}</div>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminCreatePro;
