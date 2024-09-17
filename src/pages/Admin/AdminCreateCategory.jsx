import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminCreateCategory() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState([]);
    const [showError, setShowError] = useState(false); // New state for error box visibility
    const baseURL ='https://doorsteppro.shop';
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        picture: null,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData({
            ...formData,
            picture: file,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { picture, ...categoryData } = formData;
        const categoryDataWithPicture = new FormData();

        categoryDataWithPicture.append('picture', picture);
        categoryDataWithPicture.append('name', categoryData.name);
        categoryDataWithPicture.append('description', categoryData.description);

        axios.post(`${baseURL}/services/categories/`, categoryDataWithPicture, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            navigate('/admin/category');
        })
        .catch(error => {
            console.error('Error creating category:', error);
            if (error.response && error.response.status === 400) {
                // Check if the error is related to a unique constraint on the category name
                if (error.response.data.name && error.response.data.name.includes('unique')) {
                    setFormError({ name: ['The category name must be unique.'] });
                } else {
                    setFormError(error.response.data);
                }
                setShowError(true); // Show the error box
                // Hide the error box after 5 seconds
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            } else {
                console.log(error);
            }
        });
    };

    return (
        <section>
            <div className="container py-5">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                        <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-5">
                                <h3 className="mb-5 text-center">Create New Category</h3>
                                <form onSubmit={handleSubmit} method='POST'>
                                    <div className="mb-4">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            name='name'
                                            className="form-control form-control-lg"
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            name='description'
                                            className="form-control form-control-lg"
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Picture</label>
                                        <input
                                            type="file"
                                            className="form-control form-control-lg"
                                            name='picture'
                                            required
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <button className="btn btn-dark btn-lg w-100" type="submit">Create Now</button>
                                </form>

                                {showError && (
                                    <div className="alert alert-danger mt-3">
                                        <ul>
                                            {Object.keys(formError).map((key) => (
                                                formError[key].map((message, index) => (
                                                    <li key={`${key}_${index}`}>{message}</li>
                                                ))
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <hr className="my-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminCreateCategory;
