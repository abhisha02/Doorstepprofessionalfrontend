import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import workersbanner from './workersbanner.avif';
import axios from 'axios';
import WebSocketService from '../../services/WebSocketService';
import { updateNewMessageIndicator, clearNewMessageIndicator } from '../../Redux/chatSlice';

function Professionalhome() {
  const [bookings, setBookings] = useState([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const user_basic_details = useSelector(state => state.user_basic_details);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = 'https://doorsteppro.shop';
  const token = localStorage.getItem('access');
  const currentUserId = user_basic_details.userId;

  const audioContextRef = useRef(null);
  const audioRef = useRef(new Audio(`${process.env.PUBLIC_URL}/notification.mp3`));

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUserId) {
      console.log("Connecting WebSocket for professional:", currentUserId);
      WebSocketService.connect(currentUserId);
      WebSocketService.addListener('professionalhome', handleWebSocketMessage);

      return () => {
        WebSocketService.removeListener('professionalhome');
        WebSocketService.disconnect();
      };
    }
  }, [currentUserId, dispatch]);

  const handleWebSocketMessage = useCallback((data) => {
    console.log('Received WebSocket message:', data);
    if (data.type === 'service_request_update') {
      setHasNewMessages(true);
      dispatch(updateNewMessageIndicator(data.booking.id));
      playDoubleBeep();
    }
  }, [dispatch]);

  const playDoubleBeep = useCallback(() => {
    try {
      const context = audioContextRef.current;
      if (context) {
        const playBeep = (time) => {
          const oscillator = context.createOscillator();
          const gainNode = context.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(context.destination);

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(440, time);

          gainNode.gain.setValueAtTime(0, time);
          gainNode.gain.linearRampToValueAtTime(1, time + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

          oscillator.start(time);
          oscillator.stop(time + 0.1);
        };

        const now = context.currentTime;
        playBeep(now);
        playBeep(now + 0.15);
      } else {
        console.warn('AudioContext not available');
        // Fallback to HTML5 Audio
        audioRef.current.play().catch(error => {
          console.error('Error playing notification sound:', error);
        });
      }
    } catch (error) {
      console.error('Error playing beep sound:', error);
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

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
          booking.id === bookingId ? { ...booking, status: 'accepted' } : booking
        )
      );
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
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  return (
    <div style={{ height: '500vh', width: '100vw', position: 'relative', boxSizing: 'border-box', backgroundColor: '#e0e0e0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px', boxSizing: 'border-box' }}>
        
        <div style={{ marginBottom: '10px' }}>
          <img src={workersbanner} alt="Professional Banner" style={{ width: '1000px', maxWidth: '800px', height: 'auto', borderRadius: '15px', boxShadow: '8px 8px 15px #bebebe, -8px -8px 15px #ffffff' }} />
        </div>
       
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
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '800px' }}>
          <div
            style={{
              margin: '10px',
              padding: '10px',
              backgroundColor: `${hasNewMessages ? '#d1d9e6' : '#e0e0e0'}`,
              borderRadius: '15px',
              width: '200px',
              height: '200px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff',
              transition: 'all 0.3s ease'
            }}
            onClick={() => {
              handleNavigation('/professional/service-requests');
              dispatch(clearNewMessageIndicator());
              setHasNewMessages(false);
            }}
          >
            Service Requests
          </div>
          <div
            style={{ margin: '10px', padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '15px', width: '200px', height: '200px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff', transition: 'all 0.3s ease' }}
            onClick={() => handleNavigation('/professional/profile')}
          >
            My Profile
          </div>
          <div
            style={{ margin: '10px', padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '15px', width: '200px', height: '200px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff', transition: 'all 0.3s ease' }}
            onClick={() => handleNavigation('/professional/activetasks')}
          >
            Active Assignments
          </div>
          <div
            style={{ margin: '10px', padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '15px', width: '200px', height: '200px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff', transition: 'all 0.3s ease' }}
            onClick={() => handleNavigation('/professional/pro-service-history')}
          >
            Service History
          </div>
          <div
            style={{ margin: '10px', padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '15px', width: '200px', height: '200px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 12px #bebebe, -6px -6px 12px #ffffff', transition: 'all 0.3s ease' }}
            onClick={() => handleNavigation('/professional/achievements')}
          >
            Explore Achievements
          </div>
        </div>
      </div>
    </div>
  );
}

export default Professionalhome;