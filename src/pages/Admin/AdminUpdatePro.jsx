import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AdminUpdatePro() {
  const baseURL ='https://doorsteppro.shop';
  const { id } = useParams();
  const [formError, setFormError] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    is_email_verified: false,
    is_professional: true,
    profile: null,
    job_profile: {
      gender: '',
      address: '',
      profession: '',
      years_of_exp: '',
      adhar_no: ''
    },
    average_rating: 0 // Add this line
  });
  const [profileUpdated, setProfileUpdated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${baseURL}/aadmin/professionals/${id}/`)
      .then(response => {
        setUserData({
          ...response.data,
          is_active: response.data.is_active ?? true,
          profile: response.data.profile,
          job_profile: response.data.job_profile || {
            gender: '',
            address: '',
            profession: '',
            years_of_exp: '',
            adhar_no: ''
          }
        });
      })
      .catch(error => {
        console.error('Error fetching professional details:', error);
        navigate('/admin/professionals');
      });

    axios.get(`${baseURL}/services/categories/`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, [id, navigate]);

  const handleToggleActive = () => {
    if (window.confirm(`Are you sure you want to ${userData.is_active ? 'block' : 'unblock'} this professional?`)) {
      axios.patch(`${baseURL}/aadmin/professionals/delete/${id}/`)
        .then(response => {
          setUserData(prevData => ({
            ...prevData,
            is_active: !prevData.is_active,
          }));
        })
        .catch(error => {
          console.error('Error toggling active status:', error);
        });
    }
  };

  return (
    <section>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 menu">
                <div className="text-center mb-4">
                  <h3 className="mb-3">{userData.first_name}</h3>
                  {userData.profile && (
                    <div className="mb-2">
                      <img 
                        src={userData.profile} 
                        alt="Profile"
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-group mb-4 text-center">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name='first_name'
                    value={userData.first_name}
                    className="form-control form-control-lg mx-auto"
                    style={{ maxWidth: '300px', textAlign: 'center' }} // Center text inside input
                    required
                  />
                </div>
                <div className="form-group mb-4 text-center">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name='email'
                    value={userData.email}
                    className="form-control form-control-lg mx-auto"
                    style={{ maxWidth: '300px', textAlign: 'center' }} // Center text inside input
                    required
                  />
                </div>
                <div className="form-group mb-4 text-center">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    name='phone_number'
                    value={userData.phone_number}
                    className="form-control form-control-lg mx-auto"
                    style={{ maxWidth: '300px', textAlign: 'center' }} // Center text inside input
                    required
                  />
                </div>
                <div className="form-group mb-4 text-center">
                  <label className="form-label">Profession</label>
                  <select
                    name='job_profile.profession'
                    value={userData.job_profile.profession}
                    className="form-control form-control-lg mx-auto"
                    style={{ maxWidth: '300px' }}
                  >
                    <option value="">Select Profession</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-4 text-center">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name='job_profile.address'
                    value={userData.job_profile.address}
                    className="form-control form-control-lg mx-auto"
                    style={{ maxWidth: '300px', textAlign: 'center' }} // Center text inside input
                  />
                </div>
                <div className="form-group mb-4 text-center">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="text"
                    name='job_profile.years_of_exp'
                    value={userData.job_profile.years_of_exp}
                    className="form-control form-control-lg mx-auto"
                    style={{ maxWidth: '300px', textAlign: 'center' }} // Center text inside input
                  />
                </div>
                <div className="form-group mb-4 text-center">
                  <label className="form-label">Average Rating</label>
                  <input
                    type="text"
                    name='average_rating'
                    value={userData.average_rating.toFixed(1)}
                    className="form-control form-control-lg mx-auto"
                    style={{ maxWidth: '300px', textAlign: 'center' }} // Center text inside input
                    readOnly
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-danger btn-lg" onClick={handleToggleActive}>
                    {userData.is_active ? 'Block' : 'Unblock'} Professional
                  </button>
                </div>
                {formError.length > 0 && (
                  <div className="alert alert-danger mt-4">
                    {formError.map((error, index) => (
                      <div key={index}>{error.message}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminUpdatePro;
