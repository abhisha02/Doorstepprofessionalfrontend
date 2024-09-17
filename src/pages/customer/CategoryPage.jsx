import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [services, setServices] = useState([]); // Initialize with an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(`https://doorsteppro.shop/services/category/${categoryId}/`);
        console.log('Fetched data:', response.data); // Verify this log

        // Assuming response.data is an array of services
        if (response.data && Array.isArray(response.data)) {
          setServices(response.data); // Set the state with the array of services
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error); // Log any errors
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching category details: {error.message}</p>;
  }

  if (services.length === 0) {
    return <p>No services available in this category.</p>;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Services</h1>
      <div>
        {services.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {services.map(service => (
              <div
                key={service.id}
                style={{
                  width: '300px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}
              >
                {service.image && (
                  <Link to={`/customer/services/${service.id}`} style={{ textDecoration: 'none' }}>
                    <img
                      src={service.image}
                      alt={service.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        borderRadius: '8px'
                      }}
                    />
                  </Link>
                )}
                <h4 style={{ margin: '10px 0' }}>{service.name}</h4>
                <p>Price: ${service.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Link to="/customer/home" style={{ marginTop: '20px', display: 'inline-block', padding: '10px 20px', border: '1px solid #007BFF', borderRadius: '5px', color: '#007BFF', textDecoration: 'none' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default CategoryPage;
