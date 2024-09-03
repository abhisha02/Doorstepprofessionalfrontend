import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import avatar from './avatar.jpeg';

function Adminprofileedit() {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const res = await axios.get(baseURL + '/user/details/', {
        headers: {
          'authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setUserDetails(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [userUpdateDetails, setUserUpdateDetails] = useState({
    first_name: '',
    email: '',
    phone_number: '',
    profile_pic: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserUpdateDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setUserUpdateDetails(prevState => ({
      ...prevState,
      profile_pic: e.target.files[0]
    }));
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
      form_data.append('profile_pic', userUpdateDetails.profile_pic);
    }
    
    let url = baseURL + '/user/details/edit';
    axios.post(url, form_data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(res => {
        dispatch(
          set_Authentication({
            name: '',
            isAuthenticated: false
          })
        );
        // Redirect to admin/profile after successful update
        navigate('/admin/profile');
      })
      .catch(err => console.log(err));
  };

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [authentication_user]);

  return (
    <section style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img
                    src={userDetails?.profile ? `${baseURL}${userDetails.profile}` : avatar}
                    className="rounded-circle img-fluid"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
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
                    type="email"
                    name="email"
                    placeholder={userDetails?.email || "Email"}
                    value={userUpdateDetails.email}
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
                    onChange={handleFileChange}
                    className='form-control my-2'
                  />
                  <button
                    type="submit"
                    className="btn btn-dark btn-rounded btn-lg"
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

export default Adminprofileedit;
