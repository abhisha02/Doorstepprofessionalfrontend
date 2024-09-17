import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import avatar from './avatar.jpeg';

function ProfessionalEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authentication_user = useSelector(state => state.authentication_user);
  const baseURL = 'https://doorsteppro.shop';
  const token = localStorage.getItem('access');

  const [userUpdateDetails, setUserUpdateDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    gender: '',
    address: '',
    profession: '',
    years_of_exp: '',
    adhar_no: '',
    profile_pic: null
  });

  const [categories, setCategories] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${baseURL}/professional/details/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setUserDetails(res.data);
      setUserUpdateDetails(prevState => ({
        ...prevState,
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        email: res.data.email || '',
        phone_number: res.data.phone_number || '',
        gender: res.data.job_profile?.gender || '',
        address: res.data.job_profile?.address || '',
        profession: res.data.job_profile?.profession || '',
        years_of_exp: res.data.job_profile?.years_of_exp || '',
        adhar_no: res.data.job_profile?.adhar_no || '',
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseURL}/services/categories/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserUpdateDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setUserUpdateDetails(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form_data = new FormData();
    Object.keys(userUpdateDetails).forEach(key => {
      if (userUpdateDetails[key] instanceof File) {
        form_data.append(key, userUpdateDetails[key]);
      } else {
        form_data.append(key, userUpdateDetails[key]);
      }
    });

    try {
      const res = await axios.post(`${baseURL}/professional/details/edit`, form_data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Update Response:', res.data);
      dispatch(set_Authentication({ name: '', isAuthenticated: false }));
      navigate('/professional/profile'); // Navigate on successful update
    } catch (err) {
      console.error('Update Error:', err.response ? err.response.data : err.message);
      navigate('/professional/profile'); // Navigate even if there's an error
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCategories();
  }, [authentication_user]);

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8" style={{ maxWidth: '600px' }}> {/* Ensures responsiveness */}
            <div className="card" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img
                    src={userDetails?.profile ? `${baseURL}${userDetails.profile}` : avatar}
                    className="rounded-circle img-fluid"
                    style={{ width: '100px', maxWidth: '100%' }}
                    alt='Profile'
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={userUpdateDetails.first_name}
                    onChange={handleChange}
                    className='form-control my-2'
                    style={{ maxWidth: '80%', margin: '0 auto', textAlign: 'center' }}
                  />

                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Phone Number"
                    value={userUpdateDetails.phone_number}
                    onChange={handleChange}
                    className='form-control my-2'
                    style={{ maxWidth: '80%', margin: '0 auto', textAlign: 'center' }}
                  />
                  <label className="form-label">Gender</label>
                  <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={userUpdateDetails.gender}
                    onChange={handleChange}
                    className='form-control my-2'
                    style={{ maxWidth: '80%', margin: '0 auto', textAlign: 'center' }}
                  />
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={userUpdateDetails.address}
                    onChange={handleChange}
                    className='form-control my-2'
                    style={{ maxWidth: '80%', margin: '0 auto', textAlign: 'center' }}
                  />

                  <label className="form-label">Profile Picture</label>
                  <input
                    type="file"
                    name="profile_pic"
                    onChange={handleFileChange}
                    className='form-control my-2'
                    style={{ maxWidth: '80%', margin: '0 auto', textAlign: 'center' }}
                  />
                  <button
                    type="submit"
                    className="btn btn-dark my-2"
                    style={{ maxWidth: '80%', margin: '0 auto', textAlign: 'center' }}
                  >
                    Update
                  </button>
                </form>
                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfessionalEdit;
