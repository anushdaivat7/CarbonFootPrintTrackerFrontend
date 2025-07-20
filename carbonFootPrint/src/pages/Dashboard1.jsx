import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard1 = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();
 const user = {
  name: localStorage.getItem('fullName') || 'Guest User',
  email: localStorage.getItem('email') || 'guest@example.com'
};

 const handleLogout = () => {
    localStorage.clear(); // ✅ clear session
    setShowProfileDropdown(false); // close dropdown
    navigate('/login'); // ✅ go to login
  };
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f4f6f8',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4f0f8 100%)'
    }}>
      {/* Navigation Bar */}
      <nav style={navStyle}>
        <div style={navContainerStyle}>
          <Link to="/" style={navBrandStyle}>
            <span style={{ marginRight: '10px' }}>🌱</span>
            Carbon Tracker
          </Link>
          <div style={navLinksStyle}>
            <Link to="/dashboard" style={navLinkStyle}>Summary</Link>
            <Link to="/dashboard" style={navLinkStyle}></Link>
            <Link to="/activity" style={navLinkStyle}>Activities</Link>
            <div 
              style={{
                ...navUserStyle,
                backgroundColor: showProfileDropdown ? '#e2e8f0' : '#f0f4f8'
              }}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <span style={{ marginRight: '8px' }}>👤</span>
              User Profile
              {showProfileDropdown && (
                <div style={profileDropdownStyle}>
                  <div style={profileDropdownHeader}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                    <div style={{ fontWeight: '600' }}>{user.name}</div>
                    <div style={{ color: '#718096', fontSize: '0.8rem' }}>{user.email}</div>
                  </div>
                  <div style={dropdownDivider}></div>
                  <Link 
                    to="/profile" 
                    style={dropdownItemStyle}
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    {/* Profile Settings */}
                  </Link>
                  <div 
                    style={dropdownItemStyle}
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: '1',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '3rem',
          width: '100%',
          maxWidth: '1200px'
        }}>
          <h1 style={{
            marginBottom: '1rem',
            color: '#2e7d32',
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #2e7d32 0%, #4caf50 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>🌱 Carbon Tracker Dashboard</h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>Track, reduce, and offset your carbon footprint with our comprehensive tools</p>
        </header>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          width: '100%',
          maxWidth: '1200px'
        }}>
          {/* Card 1: Activity Logging */}
          <div style={{
            ...cardStyle,
            borderTop: '4px solid #4caf50',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }} className="dashboard-card">
            <div style={iconContainerStyle}>
              <span style={{ fontSize: '2rem' }}>🚴</span>
            </div>
            <h2 style={cardTitleStyle}>Log Activity</h2>
            <p style={cardTextStyle}>Record your carbon-emitting activities.</p>
            <Link to="/activity" style={{
              ...btnStyle,
              backgroundColor: '#4caf50'
            }}>Go to Form</Link>
          </div>

          {/* Card 2: Summary & Leaderboard */}
          <div style={{
            ...cardStyle,
            borderTop: '4px solid #2196f3',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }} className="dashboard-card">
            <div style={iconContainerStyle}>
              <span style={{ fontSize: '2rem' }}>📊</span>
            </div>
            <h2 style={cardTitleStyle}>Summary & Leaderboard</h2>
            <p style={cardTextStyle}>See your stats and how you rank with others.</p>
            <Link to="/dashboard" style={{
              ...btnStyle,
              backgroundColor: '#2196f3'
            }}>View Summary</Link>
          </div>
          
          {/* Card 3: Carbon Visualization */}
<       div style={{
  ...cardStyle,
  borderTop: '4px solid #4caf50',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
}} className="dashboard-card">
  <div style={iconContainerStyle}>
    <span style={{ fontSize: '2rem' }}>📈</span>
  </div>
  <h2 style={cardTitleStyle}>Carbon Visualization</h2>
  <p style={cardTextStyle}>Track your monthly and yearly carbon footprint trends.</p>
  <Link to="/visualization" style={{
    ...btnStyle,
    backgroundColor: '#4caf50'
  }}>View Charts</Link>
</div>
        </div>
      </main>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerContainerStyle}>
          <div style={footerColumnStyle}>
            <h3 style={footerHeadingStyle}>Carbon Tracker</h3>
            <p style={footerTextStyle}>Helping you reduce your carbon footprint one activity at a time.</p>
            <div style={socialIconsStyle}>
              <a href="#" style={socialIconStyle}>📱</a>
              <a href="#" style={socialIconStyle}>🐦</a>
              <a href="#" style={socialIconStyle}>📘</a>
              <a href="#" style={socialIconStyle}>💼</a>
            </div>
          </div>
          <div style={footerColumnStyle}>
            <h3 style={footerHeadingStyle}>Quick Links</h3>
            <Link to="/dashboard" style={footerLinkStyle}>Dashboard</Link>
            <Link to="/activity" style={footerLinkStyle}>Activities</Link>
            <Link to="/users" style={footerLinkStyle}>Community</Link>
            <Link to="/about" style={footerLinkStyle}>About Us</Link>
          </div>
          <div style={footerColumnStyle}>
            <h3 style={footerHeadingStyle}>Resources</h3>
            <a href="#" style={footerLinkStyle}>Carbon Calculator</a>
            <a href="#" style={footerLinkStyle}>Sustainability Tips</a>
            <a href="#" style={footerLinkStyle}>Research Papers</a>
            <a href="#" style={footerLinkStyle}>API Documentation</a>
          </div>
          <div style={footerColumnStyle}>
            <h3 style={footerHeadingStyle}>Legal</h3>
            <a href="#" style={footerLinkStyle}>Privacy Policy</a>
            <a href="#" style={footerLinkStyle}>Terms of Service</a>
            <a href="#" style={footerLinkStyle}>Cookie Policy</a>
            <a href="#" style={footerLinkStyle}>GDPR Compliance</a>
          </div>
        </div>
        <div style={footerBottomStyle}>
          <p>© {new Date().getFullYear()} Carbon Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Add these new styles to your existing styles
const profileDropdownStyle = {
  position: 'absolute',
  right: '0',
  top: 'calc(100% + 5px)',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '250px',
  zIndex: '1000',
  overflow: 'hidden'
};

const profileDropdownHeader = {
  padding: '1.5rem',
  textAlign: 'center',
  borderBottom: '1px solid #edf2f7'
};

const dropdownDivider = {
  height: '1px',
  backgroundColor: '#edf2f7',
  margin: '0'
};

const dropdownItemStyle = {
  display: 'block',
  padding: '0.75rem 1.5rem',
  color: '#4a5568',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#f7fafc',
    color: '#2d3748'
  }
};

// Update the navUserStyle to include position relative
const navUserStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  backgroundColor: '#f0f4f8',
  borderRadius: '20px',
  marginLeft: '1rem',
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.3s ease',
  ':hover': {
    backgroundColor: '#e2e8f0'
  }
};

// Navigation Styles
const navStyle = {
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  padding: '1rem 0',
  position: 'sticky',
  top: '0',
  zIndex: '100'
};

const navContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
  width: '100%'
};

const navBrandStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  color: '#2e7d32',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center'
};

const navLinksStyle = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center'
};

const navLinkStyle = {
  color: '#555',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '1rem',
  transition: 'color 0.3s ease',
  ':hover': {
    color: '#2e7d32'
  }
};

// Card Styles
const cardStyle = {
  width: '300px',
  backgroundColor: '#ffffff',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  textAlign: 'center',
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
  }
};

const iconContainerStyle = {
  marginBottom: '1rem',
  padding: '1rem',
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const cardTitleStyle = {
  margin: '0.5rem 0',
  color: '#333',
  fontSize: '1.4rem',
  fontWeight: '600'
};

const cardTextStyle = {
  color: '#666',
  fontSize: '1rem',
  lineHeight: '1.5',
  marginBottom: '1.5rem'
};

const btnStyle = {
  display: 'inline-block',
  marginTop: '1rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#2e7d32',
  color: '#ffffff',
  borderRadius: '30px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '0.9rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    opacity: '0.9'
  }
};

// Footer Styles
const footerStyle = {
  backgroundColor: '#2d3748',
  color: '#ffffff',
  padding: '3rem 0 0',
  marginTop: '3rem'
};

const footerContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem'
};

const footerColumnStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const footerHeadingStyle = {
  fontSize: '1.2rem',
  fontWeight: '600',
  marginBottom: '1.5rem',
  color: '#ffffff'
};

const footerTextStyle = {
  color: '#a0aec0',
  marginBottom: '1.5rem',
  lineHeight: '1.6'
};

const footerLinkStyle = {
  color: '#a0aec0',
  textDecoration: 'none',
  marginBottom: '0.8rem',
  transition: 'color 0.3s ease',
  ':hover': {
    color: '#ffffff'
  }
};

const socialIconsStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem'
};

const socialIconStyle = {
  color: '#a0aec0',
  fontSize: '1.2rem',
  transition: 'color 0.3s ease',
  ':hover': {
    color: '#ffffff'
  }
};

const footerBottomStyle = {
  textAlign: 'center',
  padding: '1.5rem',
  marginTop: '2rem',
  borderTop: '1px solid #4a5568',
  color: '#a0aec0',
  fontSize: '0.9rem'
};

export default Dashboard1;