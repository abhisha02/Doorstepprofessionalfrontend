import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  // Define the base URL for media
  const BASE_URL = 'https://doorsteppro.shop';

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('https://doorsteppro.shop/bookings/cart/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartItems(response.data.items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [token]);

  const handleQuantityChange = async (id, quantity) => {
    try {
      await axios.patch(
        `https://doorsteppro.shop/bookings/cart/item/${id}/`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async (id) => {
    const confirmRemove = window.confirm("Are you sure you want to delete this item?");
    if (confirmRemove) {
      try {
        await axios.delete(`https://doorsteppro.shop/bookings/cart/item/${id}/delete/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartItems(cartItems.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  const handleAddService = () => {
    navigate('/customer/home');
  };

  const handleBookNow = async () => {
    try {
      const response = await axios.post('https://doorsteppro.shop/bookings/create-booking/', {
        cart_id: cartItems.length > 0 ? cartItems[0].cart : null,  // Pass the cart ID
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 201) {
        // Store the booking ID in local storage
        const bookingId = response.data.id; // Adjust based on the actual field name in your response
        localStorage.setItem('currentBookingId', bookingId);
  
        // Navigate to checkout page
        navigate('/customer/checkout');
      } else {
        console.error('Error booking:', response.data);
      }
    } catch (error) {
      console.error('Error booking:', error);
    }
  };
  
  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      marginTop:'10vh',
      margin: 'auto',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      marginBottom:'70vh'
    }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e9ecef',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '10px',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.service.image ? (
                  <img 
                    src={`${BASE_URL}${item.service.image}`} // Add base URL here
                    alt={item.service.name} 
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginRight: '15px'
                    }} 
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#dee2e6',
                    borderRadius: '8px',
                    marginRight: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: '#6c757d'
                  }}>
                    No Image
                  </div>
                )}
                <div>
                  <h4 style={{ margin: '0' }}>{item.service.name}</h4>
                  <p style={{ margin: '10px 0' }}><strong>Price:</strong> Rs.{item.service.price}</p>
                  <p style={{ margin: '5px 0' }}><strong>Duration:</strong> {item.service.duration} mins</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid black',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <button 
                    disabled={item.quantity <= 1}
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    style={{
                      border: 'none',
                      color: 'black',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      fontSize: '16px'
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    display: 'inline-block',
                    minWidth: '30px',
                    textAlign: 'center',
                    lineHeight: '30px',
                    padding: '8px 12px',
                    fontSize: '16px'
                  }}>{item.quantity}</span>
                  <button 
                    disabled={item.quantity >= 3}
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    style={{
                      border: 'none',
                      color: 'black',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      fontSize: '16px'
                    }}
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => handleRemove(item.id)}
                  style={{
                    border: '1px solid #dc3545',
                    color: '#dc3545',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    marginLeft: '10px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    fontSize: '16px'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}>
            <button 
              onClick={handleAddService}
              style={{
                marginRight: '10px',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 20px',
                cursor: 'pointer'
              }}
            >
              Add Another Service
            </button>
            <button 
              onClick={handleBookNow}
              style={{
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 20px',
                cursor: 'pointer'
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
