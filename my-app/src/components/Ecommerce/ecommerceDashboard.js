import React from 'react';

const EcommerceDashboard = () => {
  return (
    <div style={dashboardStyle}>
      <h1 style={headerStyle}>E-commerce Dashboard</h1>
      <div style={contentStyle}>
        <p>Welcome to the E-commerce Dashboard!</p>
        {/* Add more components or content here */}
      </div>
    </div>
  );
};

const dashboardStyle = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle = {
  fontSize: '2rem',
  color: '#333',
};

const contentStyle = {
  marginTop: '20px',
};

export default EcommerceDashboard;