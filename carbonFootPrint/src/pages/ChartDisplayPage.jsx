import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmissionChart from './EmissionChart';

const ChartDisplayPage = () => {
  const { range } = useParams(); // can be "daily", "monthly", or "yearly"
  const navigate = useNavigate();

  // Dynamic title generation
  const getTitle = () => {
    switch (range) {
      case 'monthly':
        return '🗓️ Monthly Emission Chart';
      case 'yearly':
        return '📆 Yearly Emission Chart';
      default:
        return '📊 Emission Chart';
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{getTitle()}</h1>

      {/* Bar chart */}
      <EmissionChart range={range} />

      <div style={{ textAlign: 'center' }}>
        <button
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          onClick={() => navigate('/visualization')}
        >
          🔙 Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ChartDisplayPage;
