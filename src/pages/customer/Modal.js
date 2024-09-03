// src/components/Modal.js
import React from 'react';

const Modal = ({ message, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '1000'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#d9534f' }}>Alert</h3>
        <p style={{ color: '#333' }}>{message}</p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#d9534f',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
