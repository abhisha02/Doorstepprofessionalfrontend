import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

function Favourites() {
  const user_basic_details = useSelector(state => state.user_basic_details);
  const userName = user_basic_details?.first_name || "User";
  const [services, setServices] = useState([]);
  const token = localStorage.getItem('access'); // Get token from local storage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://doorsteppro.shop/bookings/user/favourite-services/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        setServices(response.data);
      } catch (err) {
        console.error('Fetch services error:', err.response ? err.response.data : err.message);
        toast.error('Failed to fetch services.');
      }
    };

    fetchServices();
  }, [token]);
  const handleNavigation = (path) => {
    navigate(path);
  };


  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <ToastContainer />
      <div style={{ 
        fontSize: '1.5rem', 
        marginBottom: '20px', 
        textAlign: 'center', 
        width: '100%' 
      }}>
        <h3>Welcome, {user_basic_details.name}</h3>
        <h6>Favourite Services</h6>
      </div>
      <div style={{ 
        position: 'static', 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        flexWrap: 'wrap', 
        gap: '10px', 
        marginBottom: '20px', 
        width: '100%' 
      }}>
        {['My Profile', 'Service History', 'Reviews and Ratings', 'Favourites',  'Manage Address'].map((text, index) => (
          <div
            key={text}
            style={{
              backgroundColor: '#e0e0e0',
              color: '#808080',
              border: 'none',
              borderRadius: '15px',
              padding: '12px',
              width: 'calc(20% - 10px)',
              minWidth: '150px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
              transition: 'all 0.3s ease',
              ':active': {
                boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff'
              }
            }}
            onClick={() => handleNavigation(`/customer/${text.toLowerCase().replace(/\s+/g, '-')}`)}
          >
            {text}
          </div>
        ))}
      </div>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '20px', 
        justifyContent: 'center', 
        width: '100%' 
      }}>
        {services.length > 0 ? (
          services.map(service => (
            <div key={service.id} style={{ 
              width: 'calc(33.33% - 20px)', 
              minWidth: '200px', 
              maxWidth: '300px', 
              textAlign: 'center' 
            }}>
              {service.image ? (
                <Link to={`/customer/services/${service.id}`} style={{ textDecoration: 'none' }}>
                  <img 
                    src={`https://doorsteppro.shop${service.image}`}
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
              ) : (
                <div style={{ width: '100%', height: '150px', backgroundColor: '#ddd', borderRadius: '8px' }}></div>
              )}
              <h5 style={{ margin: '10px 0', fontSize: '16px' }}>{service.name}</h5>
            </div>
          ))
        ) : (
          <p>No services found</p>
        )}
      </div>
    </div>
  );
}

export default Favourites;