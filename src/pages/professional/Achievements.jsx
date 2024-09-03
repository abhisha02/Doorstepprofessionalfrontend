import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import achievement from './achievement.jpg';

function Achievements() {
  const [bookings, setBookings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const user_basic_details = useSelector(state => state.user_basic_details);
  const token = localStorage.getItem('access'); // Token for authentication
  const baseURL = 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${baseURL}/bookings/professional/achievements/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        setBookings(response.data.bookings);
        setAverageRating(response.data.average_rating);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <div style={{ height: '500vh', width: '100vw', position: 'relative', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', boxSizing: 'border-box' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '10px', textAlign: 'center' }}>
          <h2>Welcome, {user_basic_details.name}</h2>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <img src={achievement} alt="Professional Banner" style={{ width: '100%', maxWidth: '700px', height: 'auto' }} />
        </div>
        <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
          <p>Average Rating: {averageRating.toFixed(1)} Stars</p>
        </div>
        <table style={{ width: '100%', maxWidth: '800px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Rating</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{`${booking.customer.first_name} ${booking.customer.last_name}`}</td>
                <td>{new Date(booking.date).toLocaleDateString()}</td>
                <td>
                  {booking.rating 
                    ? '★'.repeat(booking.rating) + '☆'.repeat(5 - booking.rating) 
                    : 'Not yet reviewed'
                  }
                </td>
                <td>
                  {booking.review 
                    ? booking.review 
                    : 'Customer hasn’t reviewed yet'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Achievements;
