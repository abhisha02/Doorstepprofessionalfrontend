import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function AdminUpdateServices() {
  const baseURL ='https://doorsteppro.shop';
  const { id } = useParams();
  const navigate = useNavigate();

  const [formError, setFormError] = useState({});
  const [serviceData, setServiceData] = useState({
    name: '',
    description: '',
    price: '',
    rating: '',
    image: null,
    category: '',
  });

  const [previousImage, setPreviousImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchServiceDetails();
    fetchCategories();
  }, []); // Run only once on component mount

  const fetchServiceDetails = () => {
    axios.get(`${baseURL}/services/services/${id}/`)
      .then(response => {
        const { name, description, price, rating, image, category } = response.data;
        setServiceData({ name, description, price, rating, image, category });
        setPreviousImage(image);
      })
      .catch(error => {
        console.error('Error fetching service details:', error);
        navigate('/admin/services');
      });
  };

  const fetchCategories = () => {
    axios.get(`${baseURL}/services/categories/`)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setServiceData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = event => {
    setServiceData(prevData => ({
      ...prevData,
      image: event.target.files[0]
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', serviceData.name);
    formData.append('description', serviceData.description);
    formData.append('price', serviceData.price);
    formData.append('rating', serviceData.rating);
    formData.append('category', serviceData.category);

    if (serviceData.image instanceof File) {
      formData.append('image', serviceData.image);
    }

    axios.put(`${baseURL}/services/services/update/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      console.log('Service updated successfully:', response.data);
      navigate('/admin/services');
    })
    .catch(error => {
      console.error('Error updating service:', error);
      console.log(error.response); // Log detailed error response
      setFormError(error.response?.data || { detail: 'An unexpected error occurred' });
    });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4">
              <h3 className="mb-4 text-center">Update Service</h3>
              
              {serviceData.image && (
                <div className="text-center mb-4">
                  <img
                    src={typeof serviceData.image === 'string' ? serviceData.image : URL.createObjectURL(serviceData.image)}
                    alt={serviceData.name}
                    style={{ maxWidth: "100%", height: "auto" }}
                    className="img-fluid"
                  />
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name='name'
                    value={serviceData.name}
                    className="form-control form-control-lg"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name='description'
                    value={serviceData.description}
                    className="form-control"
                    rows="3"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    name='price'
                    value={serviceData.price}
                    className="form-control"
                    step="0.01"
                    min="0"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    name='category'
                    className="form-control"
                    value={serviceData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-dark btn-lg w-100">
                  Update Service
                </button>
              </form>
              
              {Object.keys(formError).length > 0 && (
                <div className='text-danger mt-4'>
                  {formError.detail ? (
                    <ul>
                      {Array.isArray(formError.detail) ? (
                        formError.detail.map((message, index) => (
                          <li key={index}>{message}</li>
                        ))
                      ) : (
                        <li>{formError.detail}</li>
                      )}
                    </ul>
                  ) : (
                    <p>An unexpected error occurred.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUpdateServices;
