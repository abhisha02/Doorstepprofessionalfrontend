import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import avatar from './avatar.jpeg';

function AdminProapproval2() {
    const baseURL = "http://127.0.0.1:8000";
    const { id } = useParams();
    const [formError, setFormError] = useState({});
    const [userData, setUserData] = useState({
        first_name: '',
        phone_number: '',
        email: '',
        is_active: true,
        job_profile: {
            gender: '',
            address: '',
            profession: '',
            years_of_exp: '',
            adhar_no: '',
            is_approved: false
        }
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetching professional data
        axios.get(`${baseURL}/aadmin/professionals/${id}/`)
            .then(response => {
                const data = response.data;
                setUserData({
                    ...data,
                    User_Profile: data.User_Profile || { profile_pic: '' }
                });
            })
            .catch(error => {
                console.error('Error fetching professional details:', error);
                navigate('/admin/professionals');
            });

        // Fetching categories data
        axios.get(`${baseURL}/services/categories/`)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, [id, navigate]);

    const handleApprove = () => {
        axios.patch(`${baseURL}/aadmin/professionals/approve/${id}/`)
            .then(response => {
                alert(response.data.message);
                navigate('/admin/professionals');
            })
            .catch(error => {
                console.error('Error approving professional:', error);
            });
    };
    
    const handleReject = () => {
        axios.patch(`${baseURL}/aadmin/professionals/reject/${id}/`)
            .then(response => {
                alert(response.data.message);
                navigate('/admin/professionals');
            })
            .catch(error => {
                console.error('Error rejecting professional:', error);
            });
    };
    
    const selectedCategory = categories.find(category => category.id === userData.job_profile.profession);

    return (
        <section>
            <div className="container py-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-5">
                                <img
                                    src={userData.User_Profile && userData.User_Profile.profile_pic ? userData.User_Profile.profile_pic : avatar}
                                    className="rounded-circle"
                                    alt="profile"
                                    style={{ width: "80px", height: "80px" }}
                                />
                                <h3 className="mb-5 text-center">Professional Approval</h3>
                                
                                <div className="mb-4">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name='first_name'
                                        value={userData.first_name}
                                        className="form-control form-control-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name='email'
                                        value={userData.email}
                                        className="form-control form-control-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Mobile Number</label>
                                    <input
                                        type="text"
                                        name='phone_number'
                                        value={userData.phone_number}
                                        className="form-control form-control-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Profession</label>
                                    <input
                                        type="text"
                                        name='job_profile.profession'
                                        value={selectedCategory ? selectedCategory.name : ''}
                                        className="form-control form-control-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        name='job_profile.address'
                                        value={userData.job_profile.address}
                                        className="form-control form-control-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Years of Experience</label>
                                    <input
                                        type="text"
                                        name='job_profile.years_of_exp'
                                        value={userData.job_profile.years_of_exp}
                                        className="form-control form-control-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Gender</label>
                                    <input
                                        type="text"
                                        name='job_profile.gender'
                                        value={userData.job_profile.gender}
                                        className="form-control form-control-lg"
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Adhar Number</label>
                                    <input
                                        type="text"
                                        name='job_profile.adhar_no'
                                        value={userData.job_profile.adhar_no}
                                        className="form-control form-control-lg"
                                        readOnly
                                    />
                                </div>
                                
                                <div className="d-flex justify-content-between mt-4">
                                    <button className="btn btn-success me-2" style={{ marginRight: '8px' }} onClick={handleApprove}>Approve</button>
                                    <button className="btn btn-danger ms-2" style={{ marginLeft: '8px' }} onClick={handleReject}>Reject</button>
                                </div>

                                <hr className="my-4"/>
                                <ul className='text-danger'>
                                    {Object.keys(formError).map((key) => {
                                        const errorMessages = Array.isArray(formError[key]) ? formError[key] : [formError[key]];
                                        return errorMessages.map((message, index) => (
                                            <li key={`${key}_${index}`}>{message}</li>
                                        ));
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .btn {
                        width: 100%;
                        margin-bottom: 10px;
                    }
                    .btn:last-child {
                        margin-bottom: 0;
                    }
                }
            `}</style>
        </section>
    );
}

export default AdminProapproval2;
