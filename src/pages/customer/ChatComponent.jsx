// src/components/ChatComponent.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import WebSocketService from '../../services/WebSocketService';

function ChatComponent({ booking, onClose, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef(null);
  const user_basic_details = useSelector(state => state.user_basic_details);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/chat/chat-history/${booking.id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`,
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();

    WebSocketService.addListener(`chat_${booking.id}`, handleChatMessage);

    return () => {
      WebSocketService.removeListener(`chat_${booking.id}`);
    };
  }, [booking.id, currentUserId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChatMessage = (data) => {
    if (data.type === 'new_message_notification' && data.booking_id === booking.id) {
      const newMessage = {
        ...data,
        isSentByCurrentUser: data.sender_id === currentUserId.toString()
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !currentUserId) {
      console.error('Cannot send message: message is empty or user ID is not available');
      return;
    }
  
    const senderId = currentUserId;
    let receiverEmail;
  
    if (user_basic_details.isProfessional) {
      receiverEmail = booking.customer.email;
    } else {
      receiverEmail = booking.professional.email;
    }
  
    if (!receiverEmail) {
      console.error('No valid receiver email');
      return;
    }
  
    const newMessage = {
      type: 'chat_message',
      booking_id: booking.id,
      message: inputMessage.trim(),
      sender_id: senderId,
      receiver_email: receiverEmail,
      timestamp: new Date().toISOString(),
      isSentByCurrentUser: true
    };
  
    console.log("Sending message:", JSON.stringify(newMessage, null, 2));
    WebSocketService.send(newMessage);
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage('');
  };

  const receiverName = user_basic_details.isProfessional ? booking.customer.first_name : booking.professional.first_name;
  const receiverProfilePic = user_basic_details.isProfessional ? booking.customer.profile : booking.professional.profile;

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatHeader}>
        <div style={styles.receiverInfo}>
          <img src={receiverProfilePic} alt={receiverName} style={styles.profilePic} />
          <h3 style={styles.chatWith}>{receiverName}</h3>
        </div>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
      <div style={styles.messagesContainer} ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            ...styles.message,
            alignSelf: msg.isSentByCurrentUser ? 'flex-end' : 'flex-start',
            backgroundColor: msg.isSentByCurrentUser ? '#dcf8c6' : '#e0e0e0',
            marginLeft: msg.isSentByCurrentUser ? 'auto' : '0',
            marginRight: msg.isSentByCurrentUser ? '0' : 'auto',
          }}>
            {msg.message}
            <span style={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}


const styles = {
  chatContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '300px',
    height: '400px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  chatHeader: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiverInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  profilePic: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  chatWith: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  closeButton: {
    backgroundColor: '#333333',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
  },
  message: {
    marginBottom: '5px',
    padding: '8px 12px',
    borderRadius: '15px',
    maxWidth: '70%',
    wordWrap: 'break-word',
  },
  timestamp: {
    fontSize: '0.8em',
    color: '#888',
    marginLeft: '5px',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
  },
  input: {
    flex: 1,
    marginRight: '10px',
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  sendButton: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  visualNotification: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    zIndex: 1000,
  },
};

export default ChatComponent;