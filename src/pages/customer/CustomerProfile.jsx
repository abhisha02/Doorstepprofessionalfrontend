import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { set_Authentication } from '../../Redux/userauthenticationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import avatar from './avatar.jpeg';

function CustomerProfile() {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const navigate = useNavigate();

  const baseURL = 'https://doorsteppro.shop';
  const token = localStorage.getItem('access');

  const [userDetails, setUserDetails] = useState(null);

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
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [authentication_user]);

  const handleEdit = () => {
    navigate('/customer/edit');
  };

  return (
    <section className="" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6"> {/* Adjusted column classes */}
            <div className="card" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <div className="mt-3 mb-4">
                  <img
                    src={userDetails?.profile ? `${baseURL}${userDetails.profile}` : avatar} // Ensure this is correctly pointing to the image URL
                    className="rounded-circle img-fluid"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }} // Ensure image is responsive and fits well
                    alt="Profile"
                  />
                </div>
                <h4 className="mb-2">{userDetails?.first_name}</h4>
                <p className="text-muted mb-1">{userDetails?.email} <span className="mx-2"></span></p>
                <p className="text-muted mb-2">{userDetails?.phone_number} <span className="mx-2"></span></p>

                <button
                  type="button"
                  className="btn btn-dark btn-rounded btn-lg"
                  onClick={handleEdit}
                  style={{ marginTop: '10px' }} // Adjusted margin to ensure spacing
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-dark btn-rounded btn-lg"
                  onClick={()=>navigate('/customer/emailedit')}
                  style={{ marginTop: '10px' ,marginLeft:'20px'}} // Adjusted margin to ensure spacing
                >
                   Edit email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CustomerProfile;
