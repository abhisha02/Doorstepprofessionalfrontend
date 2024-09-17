import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function AdminUpdateCategory() {
    const baseURL = 'https://doorsteppro.shop';
    const { id } = useParams();
    const navigate = useNavigate();

    const [formError, setFormError] = useState({});
    const [categoryData, setCategoryData] = useState({
        name: '',
        picture: null,
        description: '',
    });
    const [previousPicture, setPreviousPicture] = useState(null); // State to store previous picture

    const fetchCategoryDetails = () => {
        axios.get(`${baseURL}/services/categories/${id}/`)
            .then(response => {
                const { name, picture, description } = response.data;
                setCategoryData({ name, picture, description });
                setPreviousPicture(picture); // Store previous picture from API response
            })
            .catch(error => {
                console.error('Error fetching category details:', error);
                navigate('/admin/categories');
            });
    };

    useEffect(() => {
        fetchCategoryDetails();
    }, []); // Run only once on component mount

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCategoryData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = event => {
        setCategoryData(prevData => ({
            ...prevData,
            picture: event.target.files[0]  // Update with the selected file
        }));
    };

    const handleSubmit = event => {
        event.preventDefault();
  
        const formData = new FormData();
        formData.append('name', categoryData.name);
        formData.append('description', categoryData.description);
  
        // Append the picture only if a new one was selected
        if (categoryData.picture instanceof File) {
            formData.append('picture', categoryData.picture);
        }

        axios.put(`${baseURL}/services/categories/update/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(response => {
            console.log('Category updated successfully:', response.data);
            navigate('/admin/category');
        })
        .catch(error => {
            console.error('Error updating category:', error);
            console.log(error.response); // Log detailed error response
            setFormError(error.response?.data || { detail: 'An unexpected error occurred' });
        });
    };
  
    return (
        <div className="container py-5">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                    <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                        <div className="card-body p-4 p-md-5">
                            <h3 className="mb-4 text-center">Update Category</h3>
                            
                            {/* Display current picture if available */}
                            {categoryData.picture && (
                                <div className="text-center mb-4">
                                    <img
                                        src={typeof categoryData.picture === 'string' ? categoryData.picture : URL.createObjectURL(categoryData.picture)}
                                        alt={categoryData.name}
                                        className="img-fluid rounded"
                                        style={{ maxWidth: "100%", height: "auto" }}
                                    />
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name='name'
                                        value={categoryData.name}
                                        className="form-control form-control-lg"
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label" htmlFor="description">Description</label>
                                    <textarea
                                        id="description"
                                        name='description'
                                        value={categoryData.description}
                                        className="form-control"
                                        rows="3"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label" htmlFor="picture">Picture</label>
                                    <input
                                        id="picture"
                                        type="file"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <button type="submit" className="btn btn-dark btn-lg w-100">
                                    Update Category
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUpdateCategory;
