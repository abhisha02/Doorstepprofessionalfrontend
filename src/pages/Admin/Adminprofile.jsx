import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import avatar from './avatar.jpeg';

function Adminprofile() {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const navigate = useNavigate();
  const baseURL = 'https://doorsteppro.shop';
  const token = localStorage.getItem('access');

  const [userDetails, setUserDetails] = useState(null);
  const [userUpdateDetails, setUserUpdateDetails] = useState({
    image: null
  });

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

  const handleImageChange = (e) => {
    setUserUpdateDetails({
      image: e.target.files[0]
    });
  };

  const handleEdit = () => {
    navigate('/admin/edit');
  };

  useEffect(() => {
    fetchUserData();
  }, [authentication_user]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <section style={{ backgroundColor: '#eee', flex: '1' }}>
        <div className="container py-5">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-4">
              <div className="card" style={{ borderRadius: '15px' }}>
                <div className="card-body text-center">
                  <div className="mt-3 mb-4">
                    <img
                      src={userDetails?.profile ? `${baseURL}${userDetails.profile}` : avatar}
                      className="rounded-circle img-fluid"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      alt='Profile'
                    />
                  </div>
                  <h4 className="mb-2">{userDetails?.first_name}</h4>
                  <p className="text-muted mb-1">{userDetails?.email}</p>
                  <p className="text-muted mb-2">{userDetails?.phone_number}</p>
                  <button
                    type="button"
                    className="btn btn-dark btn-rounded btn-lg"
                    onClick={handleEdit}
                    style={{ marginLeft: '10px' }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer component should go here if you have one */}
    </div>
  );
}

export default Adminprofile;
