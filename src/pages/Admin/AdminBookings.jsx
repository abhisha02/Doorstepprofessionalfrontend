import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
  const baseURL = "http://127.0.0.1:8000";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  useEffect(() => {
    axios.get(`${baseURL}/aadmin/bookings-list`)
      .then(response => {
        const sortedBookings = response.data.sort((a, b) =>
          new Date(b.date_created) - new Date(a.date_created)
        );
        setBookings(sortedBookings);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.85em',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    };
    switch (status.toLowerCase()) {
      case 'completed':
        return { ...baseStyle, backgroundColor: '#e8f5e9', color: '#1b5e20' };
      case 'pending':
        return { ...baseStyle, backgroundColor: '#fff8e1', color: '#f57f17' };
      case 'cancelled':
        return { ...baseStyle, backgroundColor: '#ffebee', color: '#b71c1c' };
      default:
        return { ...baseStyle, backgroundColor: '#e0e0e0', color: '#333' };
    }
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2em', color: '#666' }}>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f0f2f5', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h4 style={{ textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }} className="my-4 mx-2 text-center">Bookings</h4>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }} className="table table-striped">
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>S.NO</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Booking ID</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Customer</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Professional</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Category</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Booking Items</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Price</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Scheduled Date</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Status</th>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '2px solid #e0e0e0', fontWeight: 'bold', color: '#333' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking, index) => (
              <tr key={booking.id} style={{ transition: 'background-color 0.3s' }}>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>{indexOfFirstBooking + index + 1}</td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>{booking.id}</td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>{`${booking.customer.first_name} ${booking.customer.last_name}`}</td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>{booking.professional ? `${booking.professional.first_name} ${booking.professional.last_name}` : 'Not assigned yet'}</td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>{booking.category ? booking.category.name : 'N/A'}</td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {booking.items.map(item => (
                      <li key={item.id} style={{ fontSize: '0.9em', marginBottom: '4px' }}>• {item.service.name} (x{item.quantity})</li>
                    ))}
                  </ul>
                </td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>₹{booking.price}</td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>{new Date(booking.date).toLocaleDateString()}</td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
                  <span style={getStatusStyle(booking.status)}>{booking.status}</span>
                </td>
                <td style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>{booking.rating || 'Not reviewed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {Array.from({ length: Math.ceil(bookings.length / bookingsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            style={{
              margin: '0 5px',
              padding: '8px 12px',
              border: 'none',
              backgroundColor: currentPage === i + 1 ? '#007bff' : '#fff',
              color: currentPage === i + 1 ? '#fff' : '#007bff',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;