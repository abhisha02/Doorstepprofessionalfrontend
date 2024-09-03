import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import defaultAvatar from './avatar.jpeg'; // Default fallback image

function AdminUpdateUser() {
  const baseURL = "http://127.0.0.1:8000";
  const { id } = useParams();
  const [formError, setFormError] = useState([]);
  const [userData, setUserData] = useState({
    first_name: '',
    phone_number: '',
    email: '',
    is_active: true,
    profile: null // Initialize profile as null
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching user data for ID:", id);
    axios.get(`${baseURL}/aadmin/users/${id}/`)
      .then(response => {
        console.log('Fetched user data:', response.data);
        setUserData({
          ...response.data,
          profile: response.data.profile || null // Ensure profile is handled
        });
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
        navigate('/admin/customers');
      });
  }, [id, navigate]);

  const handleInputChange = event => {
    const { name, value, type, checked } = event.target;

    setUserData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = event => {
    setUserData(prevData => ({
      ...prevData,
      profile: event.target.files[0] // Update profile with the selected file
    }));
  };

  const handleBlockUnblock = () => {
    const action = userData.is_active ? 'block' : 'unblock';
    const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);
  
    if (confirmAction) {
      const updatedUserData = { ...userData, is_active: !userData.is_active };
  
      const formData = new FormData();
      formData.append('first_name', updatedUserData.first_name);
      formData.append('phone_number', updatedUserData.phone_number);
      formData.append('email', updatedUserData.email);
      formData.append('is_active', updatedUserData.is_active);
      if (updatedUserData.profile) {
        formData.append('profile', updatedUserData.profile); // Append profile image
      }
  
      axios.put(`${baseURL}/aadmin/users/update/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set content type for file upload
        }
      })
        .then(response => {
          setUserData(updatedUserData);
        })
        .catch(error => {
          console.error(`Error ${action}ing user:`, error);
        });
    }
  };
  
  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('first_name', userData.first_name);
    formData.append('phone_number', userData.phone_number);
    formData.append('email', userData.email);
    formData.append('is_active', userData.is_active);
    if (userData.profile) {
      formData.append('profile', userData.profile); // Append profile image
    }

    axios.put(`${baseURL}/aadmin/users/update/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set content type for file upload
      }
    })
      .then(response => {
        navigate('/admin/customers');
      })
      .catch(error => {
        setFormError(error.response.data);
        console.error('Error updating user:', error);
      });
  };

  return (
    <section style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">
                {/* Display the profile picture */}
                <div className="d-flex flex-column align-items-center mb-4">
                  <img
                    src={userData?.profile_pic? userData.profile_pic :defaultAvatar}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "50%",
                      border: "1px solid #ddd",
                    }}
                  />
                  <h3 className="mt-2">{userData.first_name} {userData.last_name}</h3>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name='first_name'
                      value={userData.first_name}
                      className="form-control form-control-lg mx-auto"
                      style={{ maxWidth: '100%', textAlign: 'center' }}
                      required
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name='email'
                      value={userData.email}
                      className="form-control form-control-lg mx-auto"
                      style={{ maxWidth: '100%', textAlign: 'center' }}
                      required
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="text"
                      name='phone_number'
                      value={userData.phone_number}
                      className="form-control form-control-lg mx-auto"
                      style={{ maxWidth: '100%', textAlign: 'center' }}
                      required
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>

                  <button className="btn btn-warning btn-lg btn-block my-2" type="button" onClick={handleBlockUnblock}>
                    {userData.is_active ? 'Block User' : 'Unblock User'}
                  </button>
                  <hr className="my-4"/>
                  <ul className='text-danger'>
                    {Object.keys(formError).map((key) => (
                      formError[key].map((message, index) => (
                        <li key={`${key}_${index}`}>{message}</li>
                      ))
                    ))}
                  </ul>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminUpdateUser;


