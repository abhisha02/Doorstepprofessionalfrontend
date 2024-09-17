
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import grouppro from './service6.jpeg';

function ProServiceHistory() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [rescheduleBookingId, setRescheduleBookingId] = useState(null); // Added state for rescheduling
  const user_basic_details = useSelector(state => state.user_basic_details);
  const navigate = useNavigate();
  const baseURL = 'https://doorsteppro.shop';
  const token = localStorage.getItem('access'); // Token for authentication

  useEffect(() => {
    // Fetch active tasks from the API
    const fetchActiveTasks = async () => {
      try {
        const response = await axios.get(`${baseURL}/bookings/professional/history-tasks/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching active tasks:', error);
      }
    };

    fetchActiveTasks();
  }, [token]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Function to format time to 12-hour clock
  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  


  return (
    <div style={{ height: '500vh', width: '100vw', position: 'relative', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '10px', textAlign: 'center' }}>
          <h2>Welcome, {user_basic_details.name}</h2>
          <h6>Service History</h6>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <img src={grouppro} alt="Professional Banner" style={{ width: '100%', maxWidth: '700px', height: 'auto' }} />
        </div>
        <div style={{ fontSize: '1.5rem' }}>
          <h2>Active Assignments</h2>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '40px', left: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxSizing: 'border-box' }}></div>

      <div style={{ position: 'absolute', top: '500px', left: '45%', transform: 'translateX(-50%)', width: '45%', marginLeft: '100px', boxSizing: 'border-box', marginTop: '30px' }}>
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking.id} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '5px', boxSizing: 'border-box', border: '2px solid #000' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={booking.category.picture} alt={booking.category.name} style={{ width: '50px', height: '50px', borderRadius: '5px', marginRight: '10px' }} />
                <div><strong>Category:</strong> {booking.category.name}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                <div style={{ marginRight: '20px' }}><strong>Date:</strong> {booking.date}</div>
                <div><strong>Time:</strong> {formatTime(booking.time)}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div><strong>Customer:</strong> {booking.customer.first_name}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div><strong>Address:</strong> {booking.address.address_line_1}, {booking.address.city}, {booking.address.state}, {booking.address.country} - {booking.address.zip_code}</div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Services:</strong>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {booking.items.map(item => (
                    <li key={item.id} style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '5px' }}>
                      <div style={{ marginRight: '20px' }}><strong>Service:</strong> {item.service_name}</div>
                      <div style={{ marginRight: '20px' }}><strong>Quantity:</strong> {item.quantity}</div>
                      <div><strong>Duration:</strong> {item.duration} mins</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ color: booking.status === 'rescheduled' ? 'red' : 'black' }}>
                  <strong>Status:</strong> {booking.status}
                </div>
                <strong>Rating:</strong> {booking.rating}
                <strong>Review:</strong> {booking.review}
               
              </div>
             
            </div>
          ))
        ) : (
          <div>No active tasks found.</div>
        )}
      </div>

      
    </div>
  );
}

export default ProServiceHistory;
