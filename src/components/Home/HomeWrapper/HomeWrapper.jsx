import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import HeaderBar from '../HomeHeader/HomeHeader';
import FooterBar from '../Homefooter/Homefooter';

// Import your images
import applianceImage from './images/appliance.png';
import cleaning from './images/cleaning.jpg';
import installation from './images/installation.webp';
import laptop from './images/laptop.jpg';
import quickrepair from './images/quick repair.webp';
import salon from './images/salon.jpg';
import frontpic from './images/frontpic.png';


function HomeWrapper() {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://doorsteppro.shop/services/latest-categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const response = await axios.get('https://doorsteppro.shop/services/all-categories/');
        setAllCategories(response.data);
      } catch (error) {
        console.error('Error fetching all categories:', error);
      }
    };

    fetchCategories();
    fetchAllCategories();
  }, []);

  const handleDropdownClick = (categoryId) => {
    if (categoryId) {
      navigate(`/customer/category/${categoryId}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      minWidth: '100vw',
      margin: '0',
      padding: '0',
    }}>
      <HeaderBar />

      {/* Home delivered services section */}
      <section style={{ backgroundColor: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
        <h2>Home Delivered Services</h2>
      </section>

      {/* Main content section */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Gray box with icons */}
        <div style={{
          backgroundColor: 'lightgray',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
          maxWidth: '500px',
          marginLeft: '300px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            width: '100%',
          }}>
            <IconWithTitle icon={applianceImage} title="Home Appliance Repair" />
            <IconWithTitle icon={cleaning} title="Home Shine-Up" />
            <IconWithTitle icon={installation} title="Appliance Installation" />
            <IconWithTitle icon={laptop} title="Laptop Service" />
            <IconWithTitle icon={quickrepair} title="Quick Repair" />
            <IconWithTitle icon={salon} title="Salon at Home" />
          </div>
        </div>

        {/* Images section */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          flex: '1 1 auto',
        }}>
          <img src={frontpic} alt="Front Image" style={{
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
            maxWidth: '600px',
          }} />
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        {categories.length > 0 ? categories.map((category, index) => (
          category.id && category.latest_services ? (
            <div key={category.id} style={{
              width: '1100px', // Set the width of the category box
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f2f2f2',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              margin: '100px 0',
            }}>
              <h4 style={{ marginBottom: '20px' }}>{category.name}</h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '80px',
                justifyContent: 'center', // Center the service boxes
                alignItems: 'center',
                width: '100%',
              }}>
                {category.latest_services.length > 0 ? category.latest_services.slice(0, 5).map(service => (
                  service.id && (
                    <div key={service.id} style={{
                      width: '200px', // Width of each service box
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      textAlign: 'center',
                    }}>
                      {service.image && (
                        <Link to={`/customer/services/${service.id}`} style={{ textDecoration: 'none' }}>
                          <img src={service.image} alt={service.name} style={{
                            width: '100%',
                            height: '150px', // Height of service image
                            objectFit: 'cover',
                            cursor: 'pointer',
                            borderRadius: '8px'
                          }} />
                        </Link>
                      )}
                      <h5 style={{ margin: '5px 0', fontSize: '14px' }}>{service.name}</h5>
                    </div>
                  )
                )) : <p>No services available</p>}
              </div>
            </div>
          ) : null
        )) : <p>No categories available</p>}
      </div>

      <button onClick={() => setShowDropdown(!showDropdown)} style={{
        margin: '20px 0',
        padding: '5px 10px',
        fontSize: '14px',
        cursor: 'pointer',
        border: '1px solid #007BFF',
        borderRadius: '4px',
        backgroundColor: '#fff',
        color: '#007BFF'
      }}>
        {showDropdown ? 'Show Less' : 'Explore More Services'}
      </button>

      {showDropdown && (
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f2f2f2',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          margin: '0 auto'
        }}>
          <h4>All Categories</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {allCategories.map(category => (
              category.id && (
                <li key={category.id} style={{ margin: '10px 0' }}>
                  <button onClick={() => handleDropdownClick(category.id)} style={{
                    background: 'none',
                    border: 'none',
                    color: '#007BFF',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}>
                    {category.name}
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      <FooterBar />
    </div>
  );
}

// Component for rendering an icon with title
const IconWithTitle = ({ icon, title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <img src={icon} alt={title} style={{ width: '60px', height: '60px', marginBottom: '10px', objectFit: 'contain' }} />
    <span style={{ fontSize: '14px' }}>{title}</span>
  </div>
);

export default HomeWrapper;
