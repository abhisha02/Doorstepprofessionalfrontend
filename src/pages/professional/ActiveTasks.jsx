
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import grouppro from './service5.jpeg';
import ChatComponent from '../customer/ChatComponent';
import WebSocketService from '../../services/WebSocketService';

function ActiveTasks() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const user_basic_details = useSelector(state => state.user_basic_details);
  const bookingsWithNewMessages = useSelector(state => state.newMessages.bookingsWithNewMessages);
  const navigate = useNavigate();
  const baseURL = 'https://doorsteppro.shop';
  const token = localStorage.getItem('access');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const currentUserId = user_basic_details.userId;

  const fetchActiveTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${baseURL}/bookings/professional/active-tasks/`, {
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
  }, [token, baseURL]);


  useEffect(() => {
    fetchActiveTasks();
  
    console.log("Connecting WebSocket for professional:", currentUserId);
    WebSocketService.connect(currentUserId);
    WebSocketService.addListener('activeTasks', handleWebSocketMessage);
  
    return () => {
      console.log("Disconnecting WebSocket for professional:", currentUserId);
      WebSocketService.removeListener('activeTasks');
    };
  }, [currentUserId, fetchActiveTasks]);
  
  const handleWebSocketMessage = useCallback((data) => {
    console.log('Received WebSocket message in ActiveTasks:', data);
    if (data.type === 'booking_cancelled') {
      console.log('Booking cancelled, removing from list:', data.booking_id);
      setBookings(prevBookings => {
        const updatedBookings = prevBookings.filter(booking => booking.id !== data.booking_id);
        console.log('Updated bookings:', updatedBookings);
        return updatedBookings;
      });
    } else if (data.type === 'booking_updated') {
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === data.booking.id ? { ...booking, ...data.booking } : booking
        )
      );
    }
  }, []);

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const handleCancel = async () => {
    try {
      await axios.post(`${baseURL}/bookings/professional/cancel-booking/`, { booking_id: cancelBookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await fetchActiveTasks();
      setShowModal(false);
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const confirmCancel = (bookingId) => {
    setCancelBookingId(bookingId);
    setShowModal(true);
  };

  const ProfessionalRescheduleConfirm = async (bookingId) => {
    try {
      await axios.post(`${baseURL}/bookings/professional-confirm-reschedule/`, { booking_id: bookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await fetchActiveTasks();
    } catch (error) {
      console.error('Error confirming reschedule:', error);
    }
  };

  const handleTaskDone = async (bookingId) => {
    try {
      await axios.post(`${baseURL}/bookings/task-done/`, { booking_id: bookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await fetchActiveTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handlePaymentReceived = async (bookingId) => {
    try {
      await axios.post(`${baseURL}/bookings/payment-received/`, { booking_id: bookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await fetchActiveTasks();
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const handleCloseBooking = async (bookingId) => {
    try {
      await axios.post(`${baseURL}/bookings/close-booking/`, { booking_id: bookingId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await fetchActiveTasks();
    } catch (error) {
      console.error('Error closing booking:', error);
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
  };

  const Modal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
      <div style={modalStyles.overlay}>
        <div style={modalStyles.modal}>
          <h3>Confirm Cancellation</h3>
          <p>Are you sure you want to cancel this booking?</p>
          <div style={modalStyles.buttons}>
            <button style={modalStyles.button} onClick={onConfirm}>Yes, Cancel</button>
            <button style={modalStyles.button} onClick={onClose}>No, Keep</button>
          </div>
        </div>
      </div>
    );
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '5px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    buttons: {
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    },
    button: {
      backgroundColor: '#333333',
      color: 'white',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f0f0f0',
      padding: '40px 20px',
      boxSizing: 'border-box',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    headerTitle: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '10px',
    },
    banner: {
      width: '100%',
      maxWidth: '800px',
      height: 'auto',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px',
    },
    taskList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    taskCard: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease-in-out',
      ':hover': {
        transform: 'translateY(-5px)',
      },
    },
    taskHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
    },
    categoryIcon: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '15px',
      objectFit: 'cover',
    },
    categoryName: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
    },
    taskInfo: {
      marginBottom: '15px',
    },
    taskInfoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
    },
    label: {
      fontWeight: 'bold',
      color: '#555',
    },
    value: {
      color: '#333',
    },
    serviceList: {
      listStyleType: 'none',
      padding: 0,
      margin: '0 0 15px 0',
    },
    serviceItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      padding: '5px',
      backgroundColor: '#f8f8f8',
      borderRadius: '5px',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '5px 10px',
      borderRadius: '15px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '15px',
    },
    button: {
      padding: '8px 15px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.2s ease-in-out',
    },
    primaryButton: {
      backgroundColor: '#4a4a4a',
      color: '#fff',
      ':hover': {
        backgroundColor: '#333',
      },
    },
    secondaryButton: {
      backgroundColor: '#e0e0e0',
      color: '#333',
      ':hover': {
        backgroundColor: '#d0d0d0',
      },
    },
    dangerButton: {
      backgroundColor: '#ff4d4d',
      color: '#fff',
      ':hover': {
        backgroundColor: '#ff3333',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Welcome, {user_basic_details.name}</h1>
        <img src={grouppro} alt="Professional Banner" style={styles.banner} />
        <h2 style={styles.headerTitle}>Active Assignments</h2>
      </div>

      <div style={styles.taskList}>
        {bookings.length > 0 ? (
          bookings.map(booking => (
            <div key={booking.id} style={styles.taskCard}>
              <div style={styles.taskHeader}>
                <img src={booking.category.picture} alt={booking.category.name} style={styles.categoryIcon} />
                <span style={styles.categoryName}>{booking.category.name}</span>
              </div>
              
              <div style={styles.taskInfo}>
                <div style={styles.taskInfoItem}>
                  <span style={styles.label}>Booking ID:</span>
                  <span style={styles.value}>1101001245{booking.id}</span>
                </div>
                <div style={styles.taskInfoItem}>
                  <span style={styles.label}>Date:</span>
                  <span style={styles.value}>{booking.date}</span>
                </div>
                <div style={styles.taskInfoItem}>
                  <span style={styles.label}>Time:</span>
                  <span style={styles.value}>{formatTime(booking.time)}</span>
                </div>
                <div style={styles.taskInfoItem}>
                  <span style={styles.label}>Customer:</span>
                  <span style={styles.value}>{booking.customer.first_name}</span>
                </div>
                <div style={styles.taskInfoItem}>
                  <span style={styles.label}>Address:</span>
                  <span style={styles.value}>{`${booking.address.address_line_1}, ${booking.address.city}, ${booking.address.state}, ${booking.address.country} - ${booking.address.zip_code}`}</span>
                </div>
              </div>

              <div>
                <strong>Services:</strong>
                <ul style={styles.serviceList}>
                  {booking.items.map(item => (
                    <li key={item.id} style={styles.serviceItem}>
                      <span>{item.service_name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>{item.duration} mins</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{marginBottom: '15px'}}>
                <span style={{...styles.statusBadge, backgroundColor: booking.status === 'rescheduled' ? '#ffd700' : '#4CAF50', color: booking.status === 'rescheduled' ? '#333' : '#fff'}}>
                  {booking.status}
                </span>
                {booking.status === 'rescheduled' && (
                  <button 
                    style={{...styles.button, ...styles.primaryButton, marginLeft: '10px'}}
                    onClick={() => ProfessionalRescheduleConfirm(booking.id)}
                  >
                    Confirm
                  </button>
                )}
              </div>

              <div style={styles.buttonGroup}>
                {(booking.status === 'professional_assigned' ) && (
                  <>
                    <button 
                      style={{...styles.button, ...styles.primaryButton}}
                      onClick={() => handleTaskDone(booking.id)}
                    >
                      Task Done
                    </button>
                    <button
                      style={{...styles.button, ...styles.secondaryButton, position: 'relative'}}
                      onClick={() => handleChat(booking)}
                    >
                      Chat
                      {bookingsWithNewMessages.includes(booking.id) && (
                        <span style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          backgroundColor: '#ff4d4d',
                          borderRadius: '50%',
                          width: '10px',
                          height: '10px',
                        }}></span>
                      )}
                    </button>
                  </>
                )}
                {booking.status === 'task_done' && (
                  <button 
                    style={{...styles.button, ...styles.primaryButton}}
                    onClick={() => handlePaymentReceived(booking.id)}
                  >
                    Payment Received
                  </button>
                )}
                {booking.status === 'payment_done' && (
                  <button 
                    style={{...styles.button, ...styles.primaryButton}}
                    onClick={() => handleCloseBooking(booking.id)}
                  >
                    Close the Booking
                  </button>
                )}
                {booking.status !== 'task_done' && booking.status !== 'payment_done' && (
                  <button 
                    style={{...styles.button, ...styles.dangerButton}}
                    onClick={() => confirmCancel(booking.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', fontSize: '1.2rem', color: '#666'}}>No active tasks found.</div>
        )}
      </div>

      <Modal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onConfirm={handleCancel} 
      />

      {selectedBooking && (
        <ChatComponent 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

export default ActiveTasks;