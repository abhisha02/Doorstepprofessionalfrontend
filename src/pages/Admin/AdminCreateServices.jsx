import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminCreateServices() {
    const navigate = useNavigate();
    const [formError, setFormError] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
        category: '',
        duration: '',
        is_listed: true,
    });
    const [showError, setShowError] = useState(false);
    const baseURL = 'https://doorsteppro.shop';

    useEffect(() => {
        axios.get(`${baseURL}/services/categories/`)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log('Selected file:', file); // Debugging
        setFormData(prevData => ({
            ...prevData,
            image: file,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const serviceDataWithImage = new FormData();

        // Debug formData content
        console.log('FormData before appending:', formData);

        if (formData.image) {
            serviceDataWithImage.append('image', formData.image);
            console.log('Appending image:', formData.image); // Debugging
        } else {
            console.warn('No image file selected'); // Debugging
        }

        Object.keys(formData).forEach(key => {
            if (key !== 'image') {
                serviceDataWithImage.append(key, formData[key]);
            }
        });

        console.log('FormData content:');
        for (const [key, value] of serviceDataWithImage.entries()) {
            console.log(`${key}:`, value);
        }

        axios.post(`${baseURL}/services/services/`, serviceDataWithImage, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log('Service created successfully:', response.data);
            navigate('/admin/services');
        })
        .catch(error => {
            console.error('Error creating service:', error);
            if (error.response && error.response.status === 400) {
                if (error.response.data.name && error.response.data.name.includes('unique')) {
                    setFormError({ name: ['The service name must be unique.'] });
                } else {
                    setFormError(error.response.data);
                }
                setShowError(true);
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
                    <div className="col-12 col-md-10 col-lg-8">
                        <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-5">
                                <h3 className="mb-5 text-center">Create New Service</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            name='name'
                                            className="form-control form-control-lg"
                                            value={formData.name}
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            name='description'
                                            className="form-control form-control-lg"
                                            value={formData.description}
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            name='price'
                                            className="form-control form-control-lg"
                                            step="0.01"
                                            value={formData.price}
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Duration (in mins)</label>
                                        <input
                                            type="number"
                                            name='duration'
                                            className="form-control form-control-lg"
                                            value={formData.duration}
                                            required
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className="form-control form-control-lg"
                                            name='image'
                                            required
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">Category</label>
                                        <select
                                            name='category'
                                            className="form-control form-control-lg"
                                            value={formData.category}
                                            required
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminCreateServices;
