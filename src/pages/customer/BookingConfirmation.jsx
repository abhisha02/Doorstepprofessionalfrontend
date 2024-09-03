import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

 

  const handleExploreMore = () => {
    navigate('/customer/home');
  };

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button
          onClick={() => navigate('customer/home')}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{marginTop:'50px', padding: '20px', textAlign: 'center',minHeight:'100vh'}}>
      <h4>Your booking is confirmed!</h4>
      <p>Our team will be in touch with a professional soon.</p>
      <button
        onClick={handleExploreMore}
        style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Explore More
      </button>
    </div>
  );
};

export default BookingConfirmation;
