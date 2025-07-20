import React from 'react';
import { useNavigate } from 'react-router-dom';

const cardStyle = {
  flex: 1,
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 15px',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  alignSelf: 'flex-start',
};

const EmissionChartPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '30px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>📊 Carbon Emission Visualization</h1>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
     
        {/* Monthly Card */}
        <div style={cardStyle}>
          <h2>📅 Monthly Emissions</h2>
          <button style={buttonStyle} onClick={() => navigate('/chart/monthly')}>
            View Monthly Summary
          </button>
        </div>

        {/* Yearly Card */}
        <div style={cardStyle}>
          <h2>📆 Yearly Emissions</h2>
          <button style={{ ...buttonStyle, backgroundColor: '#2196f3' }} onClick={() => navigate('/chart/yearly')}>
            View Yearly Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmissionChartPage;
