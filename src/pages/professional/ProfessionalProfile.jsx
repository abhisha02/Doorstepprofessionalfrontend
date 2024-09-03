import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import avatar from './avatar.jpeg';

function ProfessionalProfile() {
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user);
  const navigate = useNavigate();

  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');

  const [userDetails, setUserDetails] = useState(null);
  const [categories, setCategories] = useState([]);

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
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseURL}/services/categories/`);
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCategories();
  }, [authentication_user]);

  const handleEdit = () => {
    navigate('/professional/edit');
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card" style={{ borderRadius: '15px' }}>
              <div className="card-body text-left">
                <div className="mt-3 mb-4 text-center">
                  <img
                    src={userDetails?.profile ? `${baseURL}${userDetails.profile}` : avatar}
                    className="rounded-circle img-fluid"
                    style={{ width: '100px', maxWidth: '100%' }}
                    alt='Profile'
                  />
                </div>
                <h4 className="mb-2 text-center">{userDetails?.first_name} {userDetails?.last_name}</h4>
                <div className="details">
                  <div className="detail-item"><span className="label">Email:</span> <span className="value">{userDetails?.email}</span></div>
                  <div className="detail-item"><span className="label">Phone Number:</span> <span className="value">{userDetails?.phone_number}</span></div>
                  <div className="detail-item"><span className="label">Gender:</span> <span className="value">{userDetails?.job_profile.gender}</span></div>
                  <div className="detail-item"><span className="label">Address:</span> <span className="value">{userDetails?.job_profile.address}</span></div>
                  <div className="detail-item"><span className="label">Profession:</span> <span className="value">{getCategoryName(userDetails?.job_profile.profession)}</span></div>
                  <div className="detail-item"><span className="label">Years of Experience:</span> <span className="value">{userDetails?.job_profile.years_of_exp}</span></div>
                  <div className="detail-item"><span className="label">Aadhar Number:</span> <span className="value">{userDetails?.job_profile.adhar_no}</span></div>
                  <div className="detail-item"><span className="label">Earned Points:</span> <span className="value">{userDetails?.job_profile.earned_points || 0}</span></div>
                  <div className="detail-item"><span className="label">Average Rating:</span> <span className="value">{userDetails?.average_rating ? userDetails.average_rating.toFixed(1) : 'No ratings yet'}</span></div>
                </div>
                <div className="text-center mt-4">
                  <button type="button" className="btn btn-dark btn-rounded btn-lg" onClick={handleEdit}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .details {
          display: flex;
          flex-direction: column;
          text-align: left;
          margin-top: 20px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .label {
          font-weight: bold;
          width: 150px;
          flex-shrink: 0;
        }

        .value {
          flex: 1;
          margin-left: 10px;
        }

        .card {
          padding: 20px;
        }

        .text-center {
          text-align: center;
        }

        @media (max-width: 576px) {
          .label {
            width: 100px;
          }

          .value {
            margin-left: 5px;
          }
        }
      `}</style>
    </section>
  );
}

export default ProfessionalProfile;
