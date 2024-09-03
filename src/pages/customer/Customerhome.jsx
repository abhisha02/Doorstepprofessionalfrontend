import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import customerbanner2 from './customerbanner2.jpg';

function CustomerHome() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/services/latest-categories/');
        setCategories(response.data);
        console.log("hi",categories)
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/services/all-categories/');
        setAllCategories(response.data);
      } catch (error) {
        console.error('Error fetching all categories:', error);
      }
    };

    fetchCategories();
    fetchAllCategories();
  }, []);

  const handleDropdownClick = (categoryId) => {
    console.log('Navigating to category ID:', categoryId); // Check this log
    if (categoryId) {
      navigate(`/customer/category/${categoryId}`);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    position: 'relative',
    marginBottom: '60px',
    '@media (max-width: 768px)': {
      padding: '10px',
    },
  };

  const bannerStyle = {
    width: '100%',
    maxWidth: '1200px',
    height: 'auto',
    maxHeight: '500px',
    objectFit: 'cover',
    marginBottom: '100px',
    '@media (max-width: 768px)': {
      marginBottom: '50px',
    },
  };

  const categoriesContainerStyle = {
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    flexDirection: 'column',
    gap: '50px',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      gap: '50px',
    },
  };

  const categoryStyle = {
    width: '100%',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f2f2f2',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginTop: '100px',
    '@media (max-width: 768px)': {
      marginTop: '50px',
    },
  };

  const serviceStyle = {
    width: '200px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      width: '150px',
      padding: '8px',
    },
  };

  const dropdownStyle = {
    width: '100%',
    maxWidth: '1000px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f2f2f2',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    '@media (max-width: 768px)': {
      padding: '10px',
    },
  };

  return (
    <div style={containerStyle}>
      <img src={customerbanner2} alt="Customer Banner" style={bannerStyle} />
      <h3>Home Delivered Services</h3>
      <h5>Ready to make life easier? Start here</h5>
      <div style={categoriesContainerStyle}>
        {categories.length > 0 ? categories.map((category, index) => (
          category.id && category.latest_services ? (
            <div key={category.id} style={categoryStyle}>
              <h4 style={{ marginBottom: '20px' }}>{category.name}</h4>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {category.latest_services.map(service => (
                  service.id && (
                    <div key={service.id} style={serviceStyle}>
                      {service.image && (
                        <Link to={`/customer/services/${service.id}`} style={{ textDecoration: 'none' }}>
                          <img src={service.image} alt={service.name} style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer', borderRadius: '8px' }} />
                        </Link>
                      )}
                      <h5 style={{ margin: '10px 0', fontSize: '16px' }}>{service.name}</h5>
                    </div>
                  )
                ))}
              </div>
            </div>
          ) : null
        )) : <p>No categories available</p>}
      </div>
      <button onClick={() => setShowDropdown(!showDropdown)} style={{ margin: '20px 0', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        {showDropdown ? 'Show Less' : 'Explore More Services'}
      </button>
      {showDropdown && (
        <div style={dropdownStyle}>
          <h4>All Categories</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {allCategories.map(category => (
              category.id && (
                <li key={category.id} style={{ margin: '10px 0' }}>
                  <button onClick={() => handleDropdownClick(category.id)} style={{ background: 'none', border: 'none', color: '#007BFF', fontSize: '16px', cursor: 'pointer' }}>
                    {category.name}
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
      <footer/>
    </div>
  );
}

export default CustomerHome;
