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
      const response = await axios.get('http://127.0.0.1:8000/bookings/bookings/user/', {
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
    axios.delete(`http://127.0.0.1:8000/bookings/bookings/${bookingId}/delete/`, {
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
      const response = await axios.post('http://localhost:8000/payments/initiate_payment/', {
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
            const paymentVerifyResponse = await axios.post('http://localhost:8000/payments/payment_success/', response);
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
      await axios.post('http://localhost:8000/payments/payment-failed/', {
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
    <div style={{ height: '400vh', width: '100vw', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}>
        <div style={{
          fontSize: '2rem',
          color: '#4a4a4a',
          textShadow: '2px 2px 0px #e0e0e0',
          marginBottom: '25px',
          fontFamily: 'Courier New, monospace',
          fontWeight: 'bold'
        }}>
          <h3>Welcome, {user_basic_details.name}</h3>
        </div>
        <div style={{
          fontSize: '2rem',
          color: '#4a4a4a',
          textShadow: '2px 2px 0px #e0e0e0',
          marginBottom: '25px',
          fontFamily: 'Courier New, monospace',
          fontWeight: 'bold'
        }}>
          <h4>Scheduled Bookings</h4>
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
  
      {message && (
        <div style={{ 
          position: 'fixed', 
          top: '250px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          backgroundColor: 'lightblue', 
          color: 'black', 
          padding: '10px 20px', 
          borderRadius: '5px', 
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          {message}
        </div>
      )}
  
      <div style={{ position: 'absolute', top: '250px', left: '250px', display: 'flex', flexDirection: 'column' }}>
        {error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              borderRadius: '20px',
              padding: '20px',
              width: '800px',
              height: '510px',
              marginBottom: '50px',
              marginLeft: '200px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {booking.category ? (
                  <>
                    <img src={booking.category.picture} alt={booking.category.name} style={{ width: '60px', height: '60px' }} />
                    <h4 style={{ marginRight: '10px', marginLeft: '20px' }}> {booking.category.name}</h4>
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
                <>
                  <h6>Professional Assigned: {booking.professional.first_name} {booking.professional.last_name}</h6>
                </>
              )}
              <p><strong>{getStatusMessage(booking.status, booking.professional?.name)}</strong></p>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                {(booking.status !== 'task_done' && booking.status !== 'payment_done')  && (
                  <>
                    <button
                      style={{ 
                        backgroundColor: '#f0f0f0', 
                        color: '#333', 
                        border: '1px solid #d0d0d0', 
                        borderRadius: '5px', 
                        padding: '10px 15px', 
                        marginRight: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </button>
                    <button
                      style={{ 
                        backgroundColor: '#e0e0e0', 
                        color: '#333', 
                        border: '1px solid #c0c0c0', 
                        borderRadius: '5px', 
                        padding: '10px 15px', 
                        marginRight: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onClick={() => handleReschedule(booking.id)}
                    >
                      Reschedule
                    </button>
                    {(booking.status === 'professional_assigned' ) && (
                      <button
                        style={{ 
                          backgroundColor: '#d0d0d0', 
                          color: '#333', 
                          border: '1px solid #b0b0b0', 
                          borderRadius: '5px', 
                          padding: '10px 15px',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        onClick={() => handleChat(booking)}
                      >
                        Chat
                        {bookingsWithNewMessages.includes(booking.id) && (
                          <span style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '10px',
                            height: '10px',
                          }}></span>
                        )}
                      </button>
                    )}
                  </>
                )}
                {booking.status === 'task_done' && (
                  <button
                    style={{ 
                      backgroundColor: '#c0c0c0', 
                      color: '#333', 
                      border: '1px solid #a0a0a0', 
                      borderRadius: '5px', 
                      padding: '10px 15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onClick={() => handlePayment(booking)}
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{
            background: 'linear-gradient(145deg, #f0f0f0, #e6e6e6)',
            borderRadius: '20px',
            boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
            padding: '40px',
            width: '600px',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '200px'
          }}>
            <p style={{
              fontSize: '24px',
              color: '#888',
              textAlign: 'center',
              fontWeight: '300',
              textShadow: '1px 1px 2px #fff'
            }}>
              No bookings yet
            </p>
          </div>
        )}
      </div>
      
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center'
        }}>
          <h3>We apologize</h3>
          <p>Sorry, we are unable to process booking ID: 1101001245{popupBookingId} as professionals in your area are currently busy. This booking will be cancelled.</p>
          <button
            onClick={handlePopupOk}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            OK
          </button>
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