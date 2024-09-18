import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Servicedetailed() {
  const [service, setService] = useState(null);
  const { id } = useParams();
  const authentication_user = useSelector(state => state.authentication_user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`https://doorsteppro.shop/services/services/${id}/`);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };

    fetchService();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        `https://doorsteppro.shop/bookings/cart/add/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Added to cart:', response.data);
      navigate('/customer/cart');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const replaceCart = window.confirm(error.response.data.message);
        if (replaceCart) {
          await axios.delete(`https://doorsteppro.shop/bookings/cart/clear/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          await axios.post(
            `https://doorsteppro.shop/bookings/cart/add/${id}/`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          navigate('/customer/cart');
        }
      } else {
        console.error('Error adding to cart:', error);
      }
    }
  };

  if (!service) return <div>Loading...</div>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 100px)', // Adjust the 100px based on your footer height
      padding: '20px',
      marginTop: '100px',
      marginBottom: '70vh',
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
      }}>
        <h1 style={{ marginBottom: '20px' }}>{service.name}</h1>
        {service.image && (
          <img 
            src={service.image}
            alt={service.name}
            style={{
              width: '50%',
              height: 'auto',
              marginBottom: '20px',
              borderRadius: '10px'
            }}
          />
        )}
        <div style={{ textAlign: 'left' }}>
          <p style={{ marginBottom: '10px' }}><strong>Description:</strong> {service.description}</p>
          <p style={{ marginBottom: '10px' }}><strong>Price:</strong> Rs. {service.price}</p>
          <p style={{ marginBottom: '10px' }}><strong>Duration:</strong> {service.duration} mins</p>
        </div>
        <button
          onClick={handleAddToCart}
          style={{
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default Servicedetailed;