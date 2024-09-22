import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Import the modal component

const Checkout = () => {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const bookingId = localStorage.getItem('currentBookingId');
  const token = localStorage.getItem('access');
  const currentDate = new Date().toISOString().split('T')[0];

  const fetchBookingDetails = async () => {
    if (bookingId) {
      try {
        const response = await axios.get(`https://doorsteppro.shop/bookings/booking/${bookingId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        setBooking(response.data);
      } catch (err) {
        setError('Failed to fetch booking details.');
        console.error('Fetch booking details error:', err.response ? err.response.data : err.message);
      }
    } else {
      setError('Booking ID is not found.');
      navigate('/'); // Redirect if no booking ID is found
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId, token, navigate]);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.patch(`https://doorsteppro.shop/bookings/booking-items/${itemId}/update-quantity/`, 
      { quantity: newQuantity }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      fetchBookingDetails(); // Refresh booking details
    } catch (err) {
      setError('Failed to update quantity.');
      console.error('Update quantity error:', err.response ? err.response.data : err.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    const confirmRemove = window.confirm("Are you sure you want to delete this item?");
    if (confirmRemove) {
      try {
        await axios.delete(`https://doorsteppro.shop/bookings/booking-items/${itemId}/delete`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        fetchBookingDetails(); // Refresh booking details after removal
      } catch (err) {
        setError('Failed to remove item.');
        console.error('Remove item error:', err.response ? err.response.data : err.message);
      }
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(`https://doorsteppro.shop/bookings/bookings/booking/${bookingId}/update-status/`, 
      { status: newStatus }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      localStorage.setItem('currentBookingId', null);
      navigate('/customer/bookingconfirmation'); // Redirect to booking confirmation page
    } catch (err) {
      setError('Failed to update booking status.');
      console.error('Update booking status error:', err.response ? err.response.data : err.message);
    }
  };

  const handleBookNow = () => {
    // Check if address and date/time are assigned
    if (!booking.address) {
      setModalMessage('Please select an address before booking.');
      setShowModal(true);
      return;
    }
    if (booking.date===currentDate) {
      setModalMessage('Please select a time slot before booking.');
      setShowModal(true);
      return;
    }

    // Proceed with booking if all required fields are filled
    updateStatus('confirmed');
  };

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
           
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!booking) {
    return <div>Loading...</div>;
  }

  const handleDecrement = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    } else if (currentQuantity === 1) {
      handleRemoveItem(itemId); // Remove item if quantity is 0
    }
  };

  const handleIncrement = (itemId, currentQuantity) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const totalPrice = parseFloat(booking.price) || 0;
  const tax = totalPrice * 0.05;
  const amountToPay = totalPrice + tax + 30; // Include default tip

  const hasItems = booking.items && booking.items.length > 0;
  const address = booking.address || null;


  const dateAssigned = booking.date === currentDate ? null : booking.date;
  const timeAssigned = dateAssigned ? booking.time : null;

  return (
    <div style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '100px',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h6 style={{ fontSize: '2.5rem', marginBottom: '20px', textAlign: 'center' }}>Checkout</h6>
  
      {hasItems ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          '@media (min-width: 768px)': {
            flexDirection: 'row'
          }
        }}>
          {/* Left side: Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginBottom: '20px',
            '@media (min-width: 768px)': {
              width: '30%',
              alignItems: 'flex-start',
              marginRight: '20px'
            }
          }}>
            {!address ? (
              <button
                onClick={() => navigate('/customer/addresses')}
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '200px',
                  textAlign: 'center',
                  marginBottom: '10px',
                  marginTop: '50px'
                }}
              >
                Select Address
              </button>
            ) : (
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '20px',
                width: '100%',
                maxWidth: '400px',
                marginTop: '50px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '@media (min-width: 768px)': {
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }
              }}>
                <p style={{ margin: '0 0 10px 0', textAlign: 'center', '@media (min-width: 768px)': { margin: 0, textAlign: 'left' } }}>
                  <strong>Address:</strong> {address.address_line_1}, {address.address_line_2}, {address.city}, {address.state}, {address.zip_code}, {address.country}
                </p>
                <button
                  onClick={() => navigate('/customer/addresses')}
                  style={{
                    backgroundColor: '#e0e0e0',
                    color: '#000',
                    padding: '5px 10px',
                    border: '1px solid #000',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Edit
                </button>
              </div>
            )}
            {dateAssigned && timeAssigned ? (
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '20px',
                width: '100%',
                maxWidth: '400px',
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '@media (min-width: 768px)': {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: '50px'
                }
              }}>
                <p style={{ margin: '0 0 10px 0', textAlign: 'center', '@media (min-width: 768px)': { margin: 0, textAlign: 'left' } }}>
                  <strong>Date:</strong> {dateAssigned} <strong>Time:</strong> {timeAssigned}
                </p>
                <button
                  onClick={() => navigate('/customer/slots')}
                  style={{
                    backgroundColor: '#e0e0e0',
                    color: '#000',
                    padding: '5px 10px',
                    border: '1px solid #000',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Edit
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/customer/slots')}
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '200px',
                  textAlign: 'center',
                  marginTop: '20px',
                  '@media (min-width: 768px)': {
                    marginTop: '100px'
                  }
                }}
              >
                Select Slot
              </button>
            )}
          </div>
  
          {/* Right side: Booking Details and Payment Summary */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            '@media (min-width: 768px)': {
              width: '70%'
            }
          }}>
            {/* Booking Details box */}
            <div style={{
              backgroundColor: '#e0e0e0',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              width: '100%'
            }}>
              {booking.items.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  '@media (min-width: 768px)': {
                    flexDirection: 'row'
                  }
                }}>
                  <div style={{ flexGrow: 1, marginBottom: '10px', '@media (min-width: 768px)': { marginBottom: 0 } }}>
                    <p style={{ margin: 0 }}><strong>{item.service.name}</strong></p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '5px',
                    backgroundColor: '#fff',
                    marginBottom: '10px',
                    '@media (min-width: 768px)': { marginBottom: 0 }
                  }}>
                    <button
                      onClick={() => handleDecrement(item.id, item.quantity)}
                      style={{
                        border: 'none',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        padding: '0 10px'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>−</span>
                    </button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.id, item.quantity)}
                      style={{
                        border: 'none',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        padding: '0 10px'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>+</span>
                    </button>
                  </div>
                  <p style={{ margin: '0 10px' }}><strong>Rs.{parseFloat(item.amount).toFixed(2)}</strong></p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    style={{
                      border: '1px solid #dc3545',
                      color: '#dc3545',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      fontSize: '16px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
  
            {/* Payment Summary box */}
            <div style={{
              backgroundColor: '#e0e0e0',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              width: '100%'
            }}>
              <h4>Payment Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Total Price:</span>
                <span>Rs.{totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Tax (5%):</span>
                <span>Rs.{tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Tip:</span>
                <span>Rs. 30</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Total Amount:</span>
                <span>Rs.{amountToPay.toFixed(2)}</span>
              </div>
            </div>
  
            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '5px',
                width: '100%'
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      ) : (
        <div>No items in the booking.</div>
      )}
  
      {/* Render Modal if needed */}
      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Checkout;
