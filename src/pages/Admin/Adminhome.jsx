import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Adminhome() {
  const user_basic_details = useSelector(state => state.user_basic_details);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/aadmin/admin-dashboard-data/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error('Fetch dashboard data error:', err.response ? err.response.data : err.message);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setError('Authentication token is not found.');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const chartColors = [
    '#bdc3c7',
    '#95a5a6',
    '#7f8c8d',
    '#34495e',
    '#2c3e50',
  ];

  const createChartData = (labels, data) => ({
    labels,
    datasets: [{
      data,
      backgroundColor: chartColors,
    }]
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#34495e',
        },
      },
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', flexDirection: 'row', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{
        width: '20%',
        padding: '50px',
        backgroundColor: '#fff',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        marginTop:'50px'
      }}>
        {['Professionals', 'Customers', 'Approval Submission', 'Bookings', 'Category', 'Services'].map((item, index) => (
          <button 
            key={index}
            style={sidebarButtonStyle} 
            onClick={() => handleNavigate(`/admin/${item.toLowerCase().replace(' ', '-')}`)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto'
      }}>
       <h1 style={{
  fontSize: '3.5em',
  color: '#2c3e50',
  fontFamily: "'Montserrat', 'Trebuchet MS', sans-serif",
  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  marginBottom: '40px',
  textAlign: 'center',
  position: 'relative',
  padding: '20px 0',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  fontWeight: '700',
  background: 'linear-gradient(45deg, #2c3e50, #3498db)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'fadeIn 1s ease-out'
}}>
  Welcome, {user_basic_details.name}
  <span style={{
    content: "''",
    position: 'absolute',
    bottom: '0',
    left: '50%',
    width: '80px',
    height: '4px',
    background: '#3498db',
    transform: 'translateX(-50%)',
    borderRadius: '2px'
  }}></span>
</h1>

        {dashboardData && (
          <>
            {/* Black boxes in 2x2 grid */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              {[
                { label: 'Customers', value: dashboardData.total_customers },
                { label: 'Professionals', value: dashboardData.total_professionals },
                { label: 'Bookings Completed', value: dashboardData.booking_count },
                { label: 'Total Revenue', value: ` ₹${dashboardData.total_revenue}` },
              ].map((item, index) => (
                <div key={index} style={blackBoxStyle}>
                  <h3 style={{ margin: '0', fontSize: '2em' }}>{item.value}</h3>
                  <p style={{ margin: '10px 0 0', fontSize: '1em' }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* Pie charts */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>Revenue Per Category</h3>
        {dashboardData.price_per_category && dashboardData.price_per_category.length > 0 && (
          <Doughnut 
            data={createChartData(
              dashboardData.price_per_category.map(item => item.category),
              dashboardData.price_per_category.map(item => item.total_price)
            )}
            options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Price Per Category'}}}}
          />
        )}
      </div>
      
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>Revenue Per Month</h3>
        {dashboardData.price_per_month && dashboardData.price_per_month.length > 0 && (
          <Doughnut 
            data={createChartData(
              dashboardData.price_per_month.map(item => item.month),
              dashboardData.price_per_month.map(item => item.total_price)
            )}
            options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Price Per Month'}}}}
          />
        )}
      </div>
      
      <div style={chartContainerStyle}>
        <h3 style={chartTitleStyle}>Bookings Per Category</h3>
        {dashboardData.bookings_per_category && dashboardData.bookings_per_category.length > 0 && (
          <Doughnut 
            data={createChartData(
              dashboardData.bookings_per_category.map(item => item.category),
              dashboardData.bookings_per_category.map(item => item.total_bookings)
            )}
            options={{...chartOptions, plugins: {...chartOptions.plugins, title: {display: true, text: 'Bookings Per Category'}}}}
          />
        )}
      </div>
    </div>

            {/* Top Professionals and Categories */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
  {['Top Professionals', 'Top Services'].map((title, index) => (
    <div key={index} style={topListContainerStyle}>
      <h3 style={topListTitleStyle}>{title}</h3>
      <ul style={topListStyle}>
        {dashboardData[title === 'Top Professionals' ? 'top_professionals' : 'top_categories'].map((item, idx) => (
          <li key={idx} style={{
            ...topListItemStyle,
            backgroundColor: idx % 2 === 0 ? '#f8f9fa' : '#ffffff',
            padding: '12px 15px',
            borderRadius: '8px',
            marginBottom: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }
          }}>
            <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>
              {item.name}
            </span>
            <span style={{ float: 'right', backgroundColor: '#e0e0e0', padding: '4px 8px', borderRadius: '20px', fontSize: '0.9em' }}>
              Rating: {title === 'Top Professionals' ? item.rating.toFixed(2) : (item.rating?.toFixed(2) || 'N/A')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
          </>
        )}
      </div>
    </div>
  );
}

// Styles
const sidebarButtonStyle = {
  display: 'block',
  marginBottom: '15px',
  height: '50px',
  width: '100%',
  fontSize: '16px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: '#f0f0f0',
  color: '#333',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const blackBoxStyle = {
  padding: '20px',
  margin: '10px',
  borderRadius: '15px',
  fontSize: '18px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '150px',
  backgroundColor: '#2c3e50',
  color: 'white',
};

const chartContainerStyle = {
  width: '30%',
  marginBottom: '20px',
  backgroundColor: '#ecf0f1',
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const chartTitleStyle = {
  color: '#2c3e50',
  marginBottom: '10px',
};

const topListContainerStyle = {
  width: '48%',
  padding: '25px',
  borderRadius: '15px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
};

const topListTitleStyle = {
  marginTop: '0',
  marginBottom: '20px',
  color: '#2c3e50',
  fontSize: '1.5em',
  fontWeight: 'bold',
  textAlign: 'center',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  borderBottom: '2px solid #3498db',
  paddingBottom: '10px',
};

const topListStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

const topListItemStyle = {
  marginBottom: '10px',
  fontSize: '1em',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export default Adminhome;