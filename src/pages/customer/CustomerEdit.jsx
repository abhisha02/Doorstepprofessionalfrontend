import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import avatar from './avatar.jpeg';

function CustomerEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authentication_user = useSelector(state => state.authentication_user);
  const baseURL = 'https://doorsteppro.shop';
  const token = localStorage.getItem('access');

  const [userDetails, setUserDetails] = useState(null);
  const [userUpdateDetails, setUserUpdateDetails] = useState({
    first_name: '',
    email: '',
    phone_number: '',
    profile_pic: null
  });

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${baseURL}/user/details/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setUserDetails(res.data);
      setUserUpdateDetails(prevState => ({
        ...prevState,
        first_name: res.data.first_name,
        email: res.data.email,
        phone_number: res.data.phone_number
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [authentication_user]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setUserUpdateDetails(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
    } else {
      setUserUpdateDetails(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let form_data = new FormData();
    if (userUpdateDetails.first_name) {
      form_data.append('first_name', userUpdateDetails.first_name);
    }
    if (userUpdateDetails.email) {
      form_data.append('email', userUpdateDetails.email);
    }
    if (userUpdateDetails.phone_number) {
      form_data.append('phone_number', userUpdateDetails.phone_number);
    }
    if (userUpdateDetails.profile_pic) {
      form_data.append('profile_pic', userUpdateDetails.profile_pic, userUpdateDetails.profile_pic.name);
    }
    
    let url = `${baseURL}/user/details/edit`;
    axios.post(url, form_data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => {
        console.log('Update Response:', res.data);
        dispatch(
          set_Authentication({
            name: '',
            isAuthenticated: false
          })
        );
      })
      .catch(err => {
        console.error('Update Error:', err);
      })
      .finally(() => {
        console.log('Navigating to /customer/profile');
        navigate('/customer/my-profile'); // Redirect to profile page after update attempt
      });
  };
  
  return (
    <section className="" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6"> {/* Adjusted column classes for responsiveness */}
            <div className="card" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img
                    src={userDetails?.profile ? `${baseURL}${userDetails.profile}` : avatar}
                    className="rounded-circle img-fluid"
                    style={{ maxWidth: '150px', height: 'auto' }} // Ensured responsive image sizing
                    alt='Profile'
                  />
                </div>
                
                <form onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    name="first_name" 
                    placeholder={userDetails?.first_name || "First Name"} 
                    value={userUpdateDetails.first_name} 
                    onChange={handleChange} 
                    className='form-control my-2' 
                  />
              
                  <input 
                    type="tel" 
                    name="phone_number" 
                    placeholder={userDetails?.phone_number || "Phone Number"} 
                    value={userUpdateDetails.phone_number} 
                    onChange={handleChange} 
                    className='form-control my-2' 
                  />
                  <input 
                    type="file" 
                    name="profile_pic" 
                    accept="image/png, image/jpeg" 
                    className='form-control my-2' 
                    onChange={handleChange} 
                  />
                  <button 
                    type="submit" 
                    className="btn btn-dark btn-rounded btn-lg"
                    style={{ width: '100%' }} // Full-width button for smaller screens
                  >
                    Update Details
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerEdit;
