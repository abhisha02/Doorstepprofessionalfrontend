import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SlotSelection = () => {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();
  const bookingId = localStorage.getItem('currentBookingId');
  const token = localStorage.getItem('access');

  useEffect(() => {
    if (!bookingId) {
      navigate('/'); // Redirect if no booking ID is found
    }
  }, [bookingId, navigate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Both date and time are required.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/bookings/bookings/select-slot/', 
        { booking_id: bookingId, date: selectedDate, time: selectedTime }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      navigate('/customer/checkout'); // Redirect back to checkout
    } catch (err) {
      setError('Failed to select slot.');
      console.error('Select slot error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh' 
    }}>
      <h4 style={{ marginBottom: '20px' }}>Select Slot</h4>
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Date:
          <input 
            type="date" 
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]} // current date
            max={new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]} // next 3 days
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Time:
          <select value={selectedTime} onChange={handleTimeChange} style={{ marginLeft: '10px' }}>
            <option value="">Select time</option>
            <option value="10:00">10:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="17:00">5:00 PM</option>
          </select>
        </label>
      </div>
      <button 
        onClick={handleSubmit} 
        style={{ 
          backgroundColor: '#000', 
          color: '#fff', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '10px', // Curved edges
          cursor: 'pointer', 
          fontSize: '16px'
        }}
      >
        Proceed
      </button>
    </div>
  );
};

export default SlotSelection;
