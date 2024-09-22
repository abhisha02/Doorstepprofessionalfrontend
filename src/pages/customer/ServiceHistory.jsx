import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function ServiceHistory() {
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
        const response = await axios.get('https://doorsteppro.shop/bookings/user/history-page', {
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

  const handleNavigation = (path) => {
    navigate(path);
  };

 


  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hours12 = hours % 12 || 12;
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${hours12}:${minutes} ${amPm}`;
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh' }}>
      <div className="row">
        <div className="col-12 text-center py-4">
          <h3 className="mb-2">Welcome, {user_basic_details.name}</h3>
          <h4 className="mt-4">Service History</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-lg-2 mb-4">
          <div className="d-flex flex-column align-items-center">
            {['My Profile', 'Service History', 'Reviews and Ratings', 'Favourites', 'Manage Address'].map((text, index) => (
              <button
                key={text}
                className="btn btn-light shadow-sm mb-3 w-100"
                style={{
                  maxWidth: '200px',
                  borderRadius: '15px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleNavigation(`/customer/${text.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-9 col-lg-10">
          {error ? (
            <div className="alert alert-danger" role="alert">{error}</div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="card mb-4 shadow" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    {booking.category ? (
                      <>
                        <img src={booking.category.picture} alt={booking.category.name} style={{ width: '60px', height: '60px' }} className="mr-3" />
                        <h4 className="mb-0">{booking.category.name}</h4>
                      </>
                    ) : (
                      <p>No category assigned</p>
                    )}
                  </div>
                  <h6>Booking ID: 1101001245{booking.id}</h6>
                  <div className="row mb-2">
                    <div className="col-sm-6">
                      <p className="mb-1">Date: {booking.date}</p>
                    </div>
                    <div className="col-sm-6">
                      <p className="mb-1">Time: {formatTime(booking.time)}</p>
                    </div>
                  </div>
                  <p className="mb-2">Address: {booking.address ? `${booking.address.address_line_1}, ${booking.address.city}, ${booking.address.state}, ${booking.address.country} - ${booking.address.zip_code}` : 'Address not provided'}</p>
                  <p className="mb-2">Price: Rs.{booking.price}</p>
                  <h5>Services Booked:</h5>
                  {booking.items.map(item => (
                    <div key={item.service_name} className="mb-2">
                      <div className="row">
                        <div className="col-md-4">
                          <p className="mb-1">Service: {item.service_name}</p>
                        </div>
                        <div className="col-md-4">
                          <p className="mb-1">Quantity: {item.quantity}</p>
                        </div>
                        <div className="col-md-4">
                          <p className="mb-1">Duration: {item.duration} mins</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {booking.professional && (
                    <h6 className="mb-2">Professional: {booking.professional.first_name}</h6>
                  )}
                  <p className="mb-0">Rating Given: {booking.rating ? `${booking.rating}, ` : ''} stars</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceHistory;