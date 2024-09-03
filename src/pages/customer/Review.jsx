import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Review() {
  const user_basic_details = useSelector(state => state.user_basic_details);
  const userName = user_basic_details?.first_name || "User";
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState({});
  const [review, setReview] = useState({});
  const token = localStorage.getItem('access'); // Get token from local storage

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/bookings/user/reviewpage', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings.');
        console.error('Fetch bookings error:', err.response ? err.response.data : err.message);
      }
    };

    fetchBookings();
  }, [token]);

  const handleRatingChange = (bookingId, newRating) => {
    setRating(prevState => ({ ...prevState, [bookingId]: newRating }));
  };
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleReviewChange = (bookingId, newReview) => {
    setReview(prevState => ({ ...prevState, [bookingId]: newReview }));
  };

  const handleSubmit = async (bookingId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/bookings/user/${bookingId}/review/`, {
        rating: rating[bookingId],
        review: review[bookingId],
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      // Update booking status locally to reflect the change
      setBookings(prevState =>
        prevState.map(booking =>
          booking.id === bookingId ? { ...booking, status: 'review_done' } : booking
        )
      );
      toast.success('Review submitted successfully!');
      navigate('/customer/account', {
        state: { message: 'Thank you for submitting your Review' },
      });
    } catch (err) {
      setError('Failed to submit review.');
      console.error('Submit review error:', err.response ? err.response.data : err.message);
    }
  };


  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hours12 = hours % 12 || 12;
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${hours12}:${minutes} ${amPm}`;
  };

  return (
    <div style={{ height: '600vh', width: '100vw', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
          <h3>Welcome, {user_basic_details.name}</h3>
        </div>
        <div style={{ fontSize: '1.5rem', marginTop: '20px' }}>
          <h4>Rate Your Experience</h4>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '40px', left: '20px', display: 'flex', flexDirection: 'column' }}>
        {['My Profile', 'Service History', 'Reviews and Ratings', 'Favourites',  'Manage Address'].map((text, index) => (
          <div
            key={text}
            style={{
              marginTop: index === 0 ? '150px' : '0',
              backgroundColor: '#e0e0e0',
              color: '#808080',
              border: 'none',
              borderRadius: '15px',
              padding: '12px',
              width: '200px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
              transition: 'all 0.3s ease',
              marginBottom: '70px',
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
      <div style={{ position: 'absolute', top: '40px', left: '20px', display: 'flex', flexDirection: 'column' }}></div>

      <div style={{ position: 'absolute', top: '180px', left: '250px', display: 'flex', flexDirection: 'column' }}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} style={{ padding: '50px', backgroundColor: '#fff', borderRadius: '15px', width: '800px', height: '610px', marginBottom: '10px', marginLeft: '200px', border: '2px solid #000' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {booking.category ? (
                  <>
                    <img src={booking.category.picture} alt={booking.category.name} style={{ width: '60px', height: '60px' }} />
                    <h4 style={{ marginRight: '10px', marginLeft: '20px' }}>{booking.category.name}</h4>
                  </>
                ) : (
                  <p>No category assigned</p>
                )}
              </div>
              <h6>Booking ID: 1101001245{booking.id}</h6>
              <div style={{ display: 'flex' }}>
                <p>Date: {booking.date}</p>
                <p style={{ marginLeft: '30px' }}>Time: {formatTime(booking.time)}</p>
              </div>
              <p>Address: {booking.address ? `${booking.address.address_line_1}, ${booking.address.city}, ${booking.address.state}, ${booking.address.country} - ${booking.address.zip_code}` : 'Address not provided'}</p>
              <p>Price: Rs.{booking.price}</p>
              <h5>Services Booked:</h5>
              {booking.items.map(item => (
                <div key={item.service_name} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <p>Service: {item.service_name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Duration: {item.duration} mins</p>
                  </div>
                </div>
              ))}
              {booking.professional && (
                <h6>Professional: {booking.professional.first_name}</h6>
              )}
              <div style={{ marginTop: '20px' }}>
                <label>Rating: </label>
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} onClick={() => handleRatingChange(booking.id, star)} style={{ cursor: 'pointer', color: rating[booking.id] >= star ? 'gold' : 'grey' }}>★</span>
                ))}
              </div>
              <div style={{ marginTop: '20px' }}>
               
                <textarea
                  value={review[booking.id] || ''}
                  onChange={(e) => handleReviewChange(booking.id, e.target.value)}
                  rows="4"
                  cols="50"
                  placeholder="Write your review here..."
                />
              </div>
              <button onClick={() => handleSubmit(booking.id)} style={{ marginTop: '20px' , backgroundColor: '#000', 
          color: '#fff', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '10px', // Curved edges
          cursor: 'pointer', 
          fontSize: '16px',marginLeft:'50px'}}>Submit Review</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Review;
