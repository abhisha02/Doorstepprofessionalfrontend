import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import workersbanner from './service4.jpeg';
import axios from 'axios';
import WebSocketService from '../../services/WebSocketService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ServiceRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_basic_details = useSelector(state => state.user_basic_details);
  const navigate = useNavigate();
  const baseURL = 'http://127.0.0.1:8000';
  const token = localStorage.getItem('access');
  const currentUserId = user_basic_details.userId;

  const fetchBookings = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}/bookings/professional/userrequests/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const sortedBookings = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setBookings(sortedBookings);
      console.log('Fetched bookings:', sortedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [token, baseURL]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleWebSocketMessage = useCallback((data) => {
    console.log('Received WebSocket message:', data);
    if (data.type === 'service_request_update') {
      setBookings(prevBookings => {
        const updatedBookings = prevBookings.filter(booking => booking.id !== data.booking.id);
        const newBooking = { ...data.booking, is_new: true };
        return [newBooking, ...updatedBookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });
    } else if (data.type === 'temp_professional_updated') {
      setBookings(prevBookings => {
        return prevBookings.map(booking => {
          if (booking.id === data.update.booking_id) {
            return {
              ...booking,
              temp_professional: data.update.temp_professional,
              temp_professional_updated_at: data.update.temp_professional_updated_at
            };
          }
          return booking;
        });
      });
    } else if (data.type === 'booking_rejected') {
      setBookings(prevBookings => {
        const updatedBookings = prevBookings.filter(booking => booking.id !== data.booking.id);
        if (data.booking.temp_professional === currentUserId) {
          return [{ ...data.booking, is_new: true }, ...updatedBookings];
        }
        return updatedBookings;
      });
      toast.info(`Booking ${data.booking.id} has been rejected and reassigned.`);
    } else if (data.type === 'booking_created') {
      setBookings(prevBookings => {
        if (!prevBookings.some(booking => booking.id === data.booking.id)) {
          return [{ ...data.booking, is_new: true }, ...prevBookings];
        }
        return prevBookings;
      });
      toast.info(`New booking ${data.booking.id} has been assigned to you.`);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      console.log("Connecting WebSocket for professional:", currentUserId);
      WebSocketService.connect(currentUserId);
      WebSocketService.addListener('serviceRequests', handleWebSocketMessage);

      return () => {
        WebSocketService.removeListener('serviceRequests');
        WebSocketService.disconnect();
      };
    }
  }, [currentUserId, handleWebSocketMessage]);

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const handleAccept = async (bookingId) => {
    try {
      await axios.patch(`${baseURL}/bookings/professional/accept/${bookingId}/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: 'accepted', is_new: false } : booking
        ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
      fetchBookings();
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await axios.post(`${baseURL}/bookings/professional/reject/${bookingId}/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const BookingCard = ({ booking }) => {
    const [isNew, setIsNew] = useState(booking.is_new);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
      if (isNew) {
        const timer = setTimeout(() => setIsNew(false), 5000);
        return () => clearTimeout(timer);
      }
    }, [isNew]);

    return (
      <div 
        key={booking.id} 
        style={{ 
          marginBottom: '20px', 
          padding: '50px', 
          backgroundColor: isNew ? '#e6f7ff' : '#f0f0f0',
          borderRadius: '5px', 
          boxSizing: 'border-box',
          transition: 'background-color 0.5s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {!imageLoaded && <div>Loading image...</div>}
          <img 
            src={booking.category.picture} 
            alt={booking.category.name} 
            style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '5px', 
              marginRight: '10px',
              display: imageLoaded ? 'block' : 'none'
            }} 
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageLoaded(true);
              e.target.onerror = null;
              e.target.src = 'path/to/fallback/image.jpg';
            }}
          />
          <div><strong>Category:</strong> {booking.category.name}</div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <div><strong>BookingID:</strong> 1101001245{booking.id} </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
          <div style={{ marginRight: '20px' }}><strong>Date:</strong> {booking.date}</div>
          <div><strong>Time:</strong> {formatTime(booking.time)}</div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <div><strong>Customer:</strong> {booking.customer.first_name} </div>
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
          <div><strong>Status:</strong> {booking.status}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <button 
            style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
            onClick={() => handleAccept(booking.id)}
          >
            Accept
          </button>
          <button 
            style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
            onClick={() => handleReject(booking.id)}
          >
            Reject
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '500vh', width: '100vw', position: 'relative', boxSizing: 'border-box', backgroundColor: '#f5f5f5' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '10px', width: '1200px', maxWidth: '1200px' }}>
        <img 
          src={workersbanner} 
          alt="Professional Banner" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            maxHeight: '400px', 
            objectFit: 'cover'
          }} 
        />
      </div>
        <div style={{
          fontSize: '2rem',
          color: '#4a4a4a',
          textShadow: '2px 2px 0px #e0e0e0',
          marginBottom: '155px',
          fontFamily: 'Courier New, monospace',
          fontWeight: 'bold'
        }}>
          <h3>Welcome, {user_basic_details.name}</h3>
        </div>
        <div style={{ fontSize: '1.5rem', marginBottom:'100px', color: '#333' }}>
          <h2>Service Requests</h2>
        </div>
      </div>
      <div style={{ 
        position: 'absolute', 
        top: '500px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '60%', 
        boxSizing: 'border-box', 
        marginTop: '30px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '20px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Loading bookings...</div>
        ) : bookings.length > 0 ? (
          bookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 style={{ marginTop: '20px', fontSize: '1.2rem', color: '#444' }}>No bookings found</h3>
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>There are currently no service requests available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceRequests;
