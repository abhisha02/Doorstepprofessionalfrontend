import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    country: '',
    zip_code: ''
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [confirmPincode, setConfirmPincode] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('access');
  const decodedToken = jwtDecode(token);
  const customerId = decodedToken.user_id;
  const bookingId = localStorage.getItem('currentBookingId');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('https://doorsteppro.shop/bookings/addresses/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setAddresses(response.data);
    } catch (err) {
      console.error('Fetch addresses error:', err.response ? err.response.data : err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleAddAddress = async () => {
    try {
      await axios.post('https://doorsteppro.shop/bookings/addresses/', { ...newAddress, customer: customerId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      fetchAddresses();
      resetAddressForm();
    } catch (err) {
      console.error('Add address error:', err.response ? err.response.data : err.message);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setShowAddEditForm(true);
  };

  const handleUpdateAddress = async () => {
    try {
      await axios.put(`https://doorsteppro.shop/bookings/addresses/${editingAddress.id}/`, { ...newAddress, customer: customerId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      fetchAddresses();
      resetAddressForm();
    } catch (err) {
      console.error('Update address error:', err.response ? err.response.data : err.message);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      await axios.delete(`https://doorsteppro.shop/bookings/addresses/delete/${addressToDelete}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      fetchAddresses();
      setShowDeleteModal(false);
      setAddressToDelete(null);
    } catch (err) {
      console.error('Delete address error:', err.response ? err.response.data : err.message);
    }
  };

  const openDeleteModal = (addressId) => {
    setAddressToDelete(addressId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAddressToDelete(null);
  };

  const handleConfirmPincodeChange = (e) => {
    setConfirmPincode(e.target.value);
  };
  const handleAssignAddress = async () => {
    try {
      await axios.patch(`https://doorsteppro.shop/bookings/bookings/${bookingId}/assign-address/`, { address_id: selectedAddressId, address_pincode: confirmPincode  }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      navigate('/customer/checkout');
    } catch (err) {
      console.error('Assign address error:', err.response ? err.response.data : err.message);
    }
  };

  const resetAddressForm = () => {
    setNewAddress({
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      country: '',
      zip_code: ''
    });
    setEditingAddress(null);
    setShowAddEditForm(false);
  };

  return (
    <div style={{ 
      padding: '5%', 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '5%', 
        color: '#333',
        fontSize: 'clamp(20px, 4vw, 28px)',
        fontWeight: 'bold'
      }}>
        Saved Addresses
      </h2>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '15px' 
      }}>
        {addresses.map(address => (
          <div
            key={address.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '15px',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              border: selectedAddressId === address.id ? '2px solid #4a4a4a' : '1px solid #e0e0e0',
              width: '100%',
              maxWidth: '700px',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setSelectedAddressId(address.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
              <input
                type="radio"
                checked={selectedAddressId === address.id}
                onChange={() => setSelectedAddressId(address.id)}
                style={{ marginRight: '15px', transform: 'scale(1.2)' }}
              />
              <p style={{ margin: 0, fontSize: 'clamp(14px, 3vw, 16px)', color: '#333', flexGrow: 1, wordBreak: 'break-word' }}>
                {address.address_line_1}, {address.city}, {address.state}, {address.country} - {address.zip_code}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
              <button
                onClick={() => handleEditAddress(address)}
                style={{
                  marginRight: '15px',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: '#4a4a4a',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  fontSize: 'clamp(12px, 2.5vw, 14px)'
                }}
              >
                Edit
              </button>
              <svg 
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(address.id);
                }}
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ff4d4d" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ cursor: 'pointer' }}
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        margin: '5% 0',
        flexDirection: 'column'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '300px'
        }}>
          <input
            type="text"
            value={confirmPincode}
            onChange={handleConfirmPincodeChange}
            placeholder="Confirm Pincode"
            style={{
              padding: '12px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '100%',
              textAlign: 'center',
              fontSize: 'clamp(14px, 3vw, 16px)',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '300px', gap: '10px' }}>
          <button
            onClick={() => {
              resetAddressForm();
              setShowAddEditForm(true);
            }}
            style={{
              backgroundColor: '#4a4a4a',
              color: '#fff',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 3vw, 16px)',
              transition: 'background-color 0.3s ease'
            }}
          >
            Add Another Address
          </button>
          <button
            onClick={handleAssignAddress}
            style={{
              backgroundColor: '#2c2c2c',
              color: '#fff',
              padding: '12px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 3vw, 16px)',
              transition: 'background-color 0.3s ease'
            }}
          >
            Proceed
          </button>
        </div>
      </div>

      {showAddEditForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '5%',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#333', fontSize: 'clamp(18px, 4vw, 24px)' }}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            {['address_line_1', 'address_line_2', 'city', 'state', 'country', 'zip_code'].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={newAddress[field]}
                onChange={handleInputChange}
                placeholder={field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '15px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: 'clamp(14px, 3vw, 16px)'
                }}
              />
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                style={{
                  backgroundColor: '#4a4a4a',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  fontSize: 'clamp(14px, 3vw, 16px)'
                }}
              >
                {editingAddress ? 'Update Address' : 'Add Address'}
              </button>
              <button
                onClick={resetAddressForm}
                style={{
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: 'clamp(14px, 3vw, 16px)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '5%',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333', fontSize: 'clamp(16px, 3.5vw, 20px)' }}>Are you sure you want to delete this address?</h3>
            <button
              onClick={handleDeleteAddress}
              style={{
                backgroundColor: '#ff4d4d',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
                fontSize: 'clamp(14px, 3vw, 16px)'
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={closeDeleteModal}
              style={{
                backgroundColor: '#e0e0e0',
                color: '#333',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: 'clamp(14px, 3vw, 16px)'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;