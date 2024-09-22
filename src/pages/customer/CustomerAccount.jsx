// src/components/CustomerAccount.js

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ChatComponent from './ChatComponent';
import { jwtDecode } from "jwt-decode";
import { clearNewMessageIndicator } from '../../Redux/chatSlice';
import webSocketService from '../../services/WebSocketService';

function CustomerAccount() {
  const user_basic_details = useSelector(state => state.user_basic_details);
  const auth = useSelector(state => state.authentication_user);
  const currentUserId = user_basic_details.userId;
  console.log("CustomerAccount - currentUserId1:", currentUserId);
  const userName = user_basic_details?.first_name || "User";
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || null);
  const token = localStorage.getItem('access');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const dispatch = useDispatch();
  const bookingsWithNewMessages = useSelector(state => state.newMessages.bookingsWithNewMessages);
  const [showPopup, setShowPopup] = useState(false);
  const [popupBookingId, setPopupBookingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://doorsteppro.shop/bookings/bookings/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setBookings(response.data);
      console.log("Fetched bookings:", response.data);
    } catch (err) {
      setError('Failed to fetch bookings.');
      console.error('Fetch bookings error:', err.response ? err.response.data : err.message);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, [token]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const handleBookingUpdate = (data) => {
      console.log("Received WebSocket data:", data);
      if (data.type === 'booking_update') {
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === data.booking.id 
              ? { 
                  ...booking, 
                  status: data.booking.status,
                  professional: {
                    ...booking.professional,
                    first_name: data.booking.professional.name.split(' ')[0],
                    last_name: data.booking.professional.name.split(' ')[1] || ''
                  }
                } 
              : booking
          )
        );
        
        let updatedMessage;
        if (data.booking.status === 'professional_none') {
          updatedMessage = `Booking ${data.booking.id} has been cancelled by the professional. We are currently working to find a new professional for you.`;
        } else if (data.booking.status === 'professional_assigned') {
          updatedMessage = `Booking ${data.booking.id} has been updated. Professional ${data.booking.professional.name} has been assigned.`;
        }
        
        setMessage(updatedMessage);
      }
    };

    webSocketService.addListener('customerAccount', handleBookingUpdate);

    return () => {
      webSocketService.removeListener('customerAccount');
    };
  }, []);

  useEffect(() => {
    console.log("Bookings state updated:", bookings);
  }, [bookings]);

  useEffect(() => {
    const bookingWithUnavailableProfessional = bookings.find(booking => booking.status === 'professional_not_available');
    if (bookingWithUnavailableProfessional) {
      setShowPopup(true);
      setPopupBookingId(bookingWithUnavailableProfessional.id);
    }
  }, [bookings]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleReschedule = (bookingId) => {
    localStorage.setItem('currentBookingId', bookingId);
    navigate('/customer/reschedule');
  };

  const handleCancel = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking.status === 'professional_not_available') {
      // Directly cancel without confirmation
      cancelBooking(bookingId);
    } else {
      const isConfirmed = window.confirm('Are you sure you want to cancel this booking?');
      if (isConfirmed) {
        cancelBooking(bookingId);
      }
    }
  };
  
  const cancelBooking = (bookingId) => {
    axios.delete(`https://doorsteppro.shop/bookings/bookings/${bookingId}/delete/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      alert('Booking canceled successfully.');
    })
    .catch(err => {
      setError('Failed to cancel booking.');
      console.error('Cancel booking error:', err.response ? err.response.data : err.message);
    });
  };
  const handlePopupOk = () => {
    setShowPopup(false);
    if (popupBookingId) {
      handleCancel(popupBookingId);
    }
  };
  const handleChat = (booking) => {
    setSelectedBooking({
      ...booking,
      customer: {
        ...booking.customer,
        id: booking.customer.toString()
      },
      professional: {
        ...booking.professional,
        id: booking.professional.toString()
      }
    });
    dispatch(clearNewMessageIndicator(booking.id));
  };

  const formatTime = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hours12 = hours % 12 || 12;
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${hours12}:${minutes} ${amPm}`;
  };

  const getStatusMessage = (status, professional) => {
    switch (status) {
      case 'created':
        return 'A professional will be assigned to your service soon.';
      case 'professional_assigned':
        return `A professional has been assigned to your service. Expect a call an hour prior to your appointment.`;
      case 'rescheduled':
        return 'Your appointment has been rescheduled. Await confirmation from your assigned professional shortly.';
      case 'professional_none':
        return 'The professional for your booking has canceled. We are currently working to find a new professional for you. Thank you for your patience.';
      case 'task_done':
        return 'We are pleased to inform you that the task is completed. Kindly process the payment.';
        
      case 'professional_not_available':
          return 'We are unable to process this booking as professionals in your area are currently busy.';
      default:
        return status;
    }
  };
  const handlePayment = async (booking) => {
    console.log("Starting payment process for booking:", booking.id);
    try {
      console.log("Initiating payment request to backend");
      const response = await axios.post('https://doorsteppro.shop/payments/initiate_payment/', {
        booking_id: booking.id
      });
      console.log("Payment data received:", response.data);
  
      if (!response.data || !response.data.payment) {
        throw new Error("Invalid response from server");
      }
  
      console.log("Amount:", response.data.payment.amount);
      console.log("Currency:", response.data.payment.currency);
      console.log("Order ID:", response.data.payment.id);
  
      const options = {
        key: 'rzp_test_5bNJEbodpoHjmZ',
        amount: response.data.payment.amount,
        currency: response.data.payment.currency,
        name: "Your Company Name",
        description: `Payment for Booking ${booking.id}`,
        order_id: response.data.payment.id,
        handler: async (response) => {
          console.log("Payment successful, verifying with backend");
          try {
            const paymentVerifyResponse = await axios.post('https://doorsteppro.shop/payments/payment_success/', response);
            console.log("Payment verification response:", paymentVerifyResponse.data);
            
            setBookings(prevBookings =>
              prevBookings.map(b =>
                b.id === booking.id ? {...b, status: 'payment_done'} : b
              )
            );
            
            await fetchBookings();
            setMessage("Payment successful! Your booking has been updated.");
          } catch (error) {
            console.error("Payment verification failed", error);
            setError("Payment verification failed. Please contact support.");
            await handlePaymentFailure(booking.id);
          }
        },
        modal: {
          ondismiss: async function() {
            console.log('Payment modal closed');
            await handlePaymentFailure(booking.id);
          }
        },
        prefill: {
          name: `${booking.customer.first_name} ${booking.customer.last_name}`,
          email: booking.customer.email,
          contact: booking.customer.phone_number
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      console.log("Razorpay options:", options);
  
      if (typeof window.Razorpay !== 'function') {
        throw new Error("Razorpay script not loaded");
      }
  
      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response){
        console.error("Payment failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
        handlePaymentFailure(booking.id);
      });
  
      console.log("Opening Razorpay payment modal");
      rzp1.open();
    } catch (error) {
      console.error("Error in handlePayment:", error);
      setError(`Failed to initiate payment: ${error.message}`);
      await handlePaymentFailure(booking.id);
    }
  };
  
  const handlePaymentFailure = async (bookingId) => {
    try {
      await axios.post('https://doorsteppro.shop/payments/payment-failed/', {
        razorpay_order_id: bookingId
      });
      
      // Update UI or state to reflect failed payment
      setBookings(prevBookings =>
        prevBookings.map(b =>
          b.id === bookingId ? {...b, status: 'payment_failed'} : b
        )
      );
      
      // Call fetchBookings() after payment failure
      await fetchBookings();
      
      setError("Payment failed. Please try again or contact support.");
    } catch (error) {
      console.error("Failed to update booking status after payment failure", error);
      setError("An error occurred while updating your booking. Please contact support.");
    }
  };
  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="row">
        <div className="col-12 text-center py-4">
          <h3 className="display-4">Welcome, {user_basic_details.name}</h3>
          <h4 className="mt-3">Scheduled Bookings</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 col-lg-2 d-flex flex-column align-items-center mb-4">
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

        <div className="col-md-9 col-lg-10">
          {message && (
            <div className="alert alert-info text-center my-3" role="alert">
              {message}
            </div>
          )}

          {error ? (
            <div className="alert alert-danger" role="alert">{error}</div>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="card mb-4 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    {booking.category ? (
                      <>
                        <img src={booking.category.picture} alt={booking.category.name} style={{ width: '60px', height: '60px' }} className="mr-3" />
                        <h5 className="mb-0">{booking.category.name}</h5>
                      </>
                    ) : (
                      <p>No category assigned</p>
                    )}
                  </div>
                  <h6>Booking ID: 1101001245{booking.id}</h6>
                  <div className="row">
                    <div className="col-sm-6">
                      <p>Date: {booking.date}</p>
                    </div>
                    <div className="col-sm-6">
                      <p>Time: {formatTime(booking.time)}</p>
                    </div>
                  </div>
                  <p>Address: {booking.address ? `${booking.address.address_line_1}, ${booking.address.city}, ${booking.address.state}, ${booking.address.country} - ${booking.address.zip_code}` : 'Address not provided'}</p>
                  <p>Price: Rs.{booking.price}</p>
                  <h5>Services Booked:</h5>
                  {booking.items.map(item => (
                    <div key={item.service_name} className="mb-2">
                      <div className="row">
                        <div className="col-md-4">
                          <p>Service: {item.service_name}</p>
                        </div>
                        <div className="col-md-4">
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <div className="col-md-4">
                          <p>Duration: {item.duration} mins</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {booking.professional && (
                    <h6>Professional Assigned: {booking.professional.first_name} {booking.professional.last_name}</h6>
                  )}
                  <p><strong>{getStatusMessage(booking.status, booking.professional?.name)}</strong></p>
                  
                  <div className="d-flex justify-content-center mt-3">
                    {(booking.status !== 'task_done' && booking.status !== 'payment_done') && (
                      <>
                        <button
                          className="btn btn-outline-secondary mr-2"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-outline-primary mr-2"
                          onClick={() => handleReschedule(booking.id)}
                        >
                          Reschedule
                        </button>
                        {(booking.status === 'professional_assigned') && (
                          <button
                            className="btn btn-outline-info position-relative"
                            onClick={() => handleChat(booking)}
                          >
                            Chat
                            {bookingsWithNewMessages.includes(booking.id) && (
                              <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                <span className="visually-hidden">New messages</span>
                              </span>
                            )}
                          </button>
                        )}
                      </>
                    )}
                    {booking.status === 'task_done' && (
                      <button
                        className="btn btn-success"
                        onClick={() => handlePayment(booking)}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <p className="h4 text-muted">No bookings yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showPopup && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">We apologize</h5>
              </div>
              <div className="modal-body">
                <p>Sorry, we are unable to process booking ID: 1101001245{popupBookingId} as professionals in your area are currently busy. This booking will be cancelled.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handlePopupOk}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedBooking && (
        <ChatComponent 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)}
          currentUserId={currentUserId ? currentUserId.toString() : null}
        />
      )}
    </div>
  );
}

export default CustomerAccount;