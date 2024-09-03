import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ManageAddress = () => {
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
      const response = await axios.get('http://127.0.0.1:8000/bookings/addresses/', {
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
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleAddAddress = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/bookings/addresses/', { ...newAddress, customer: customerId }, {
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
      await axios.put(`http://127.0.0.1:8000/bookings/addresses/${editingAddress.id}/`, { ...newAddress, customer: customerId }, {
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
      await axios.delete(`http://127.0.0.1:8000/bookings/addresses/delete/${addressToDelete}/`, {
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
    <div style={{ padding: '20px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Saved Addresses</h3>
      <div style={{ position: 'absolute', top: '5px', left: '20px', display: 'flex', flexDirection: 'column' }}>
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
              marginBottom: '30px',
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {addresses.map(address => (
          <div
            key={address.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              padding: '10px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: selectedAddressId === address.id ? '2px solid #007bff' : 'none',
              width: '100%',
              maxWidth: '600px'
            }}
            onClick={() => setSelectedAddressId(address.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
             
              <p>{address.address_line_1}, {address.city}, {address.state}, {address.country} - {address.zip_code}</p>
            </div>
            <div>
              <button
                onClick={() => handleEditAddress(address)}
                style={{
                  marginRight: '10px',
                  borderRadius: '8px',
                  border: '2px solid #333',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#000',
                  color: '#fff'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteModal(address.id)}
                style={{
                  borderRadius: '8px',
                  border: '2px solid #333',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  backgroundColor: '#000',
                  color: '#fff'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => {
            resetAddressForm(); // Clear form on opening
            setShowAddEditForm(true);
          }}
          style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          Add Another Address
        </button>
       
      </div>

      {/* Overlay for Add/Edit Address */}
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
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
            <input type="text" name="address_line_1" value={newAddress.address_line_1} onChange={handleInputChange} placeholder="Address Line 1" />
            <input type="text" name="address_line_2" value={newAddress.address_line_2} onChange={handleInputChange} placeholder="Address Line 2" />
            <input type="text" name="city" value={newAddress.city} onChange={handleInputChange} placeholder="City" />
            <input type="text" name="state" value={newAddress.state} onChange={handleInputChange} placeholder="State" />
            <input type="text" name="country" value={newAddress.country} onChange={handleInputChange} placeholder="Country" />
            <input type="text" name="zip_code" value={newAddress.zip_code} onChange={handleInputChange} placeholder="Zip Code" />
            <button
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
            <button
              onClick={resetAddressForm}
              style={{
                backgroundColor: '#e0e0e0',
                color: '#000',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3>Are you sure you want to delete this address?</h3>
            <button
              onClick={handleDeleteAddress}
              style={{
                backgroundColor: '#ff0000',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={closeDeleteModal}
              style={{
                backgroundColor: '#e0e0e0',
                color: '#000',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
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

export default ManageAddress;
