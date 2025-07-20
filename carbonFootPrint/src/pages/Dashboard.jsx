import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card, Alert } from 'react-bootstrap';
import { generatePDFReport } from '../utils/reportGenerator';
import { generateExcelReport } from '../utils/excelGenerator';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/login');
    } else {
      setUserEmail(email);
      setSearchEmail(email); // Auto-fill with logged-in user's email
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSearch = async () => {
    if (!searchEmail) {
      setError('Please enter your email.');
      setSearchResult(null);
      return;
    }

    // Check if searched email matches logged-in user's email
    if (searchEmail !== userEmail) {
      setError('You can only view your own carbon footprint data.');
      setSearchResult(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/carbon/user/email/${searchEmail}`);
      setSearchResult(res.data);
      setError('');

      // 🏅 Badges logic
      const badges = [];
      const activities = res.data.activities;

      const last7Days = activities.filter((a) => {
        const now = new Date();
        const activityDate = new Date(a.timestamp);
        return (now - activityDate) / (1000 * 60 * 60 * 24) <= 7 && a.emission < 10;
      });

      if (last7Days.length >= 7) badges.push('Green Champion');
      if (!activities.some(a => a.activityType.toLowerCase().includes('car'))) badges.push('Eco Commuter');

      setUserBadges(badges);
    } catch (err) {
      setSearchResult(null);
      setUserBadges([]);
      setError('Error fetching your data. Please try again.');
    }
  };

  const handleDownloadPDF = () => {
    if (searchResult?.activities?.length > 0) {
      generatePDFReport(searchEmail, searchResult.activities);
    }
  };

  const handleDownloadExcel = () => {
    if (searchResult?.activities?.length > 0) {
      generateExcelReport(searchEmail, searchResult.activities);
    }
  };

  // Background styles
  const styles = {
    backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    padding: '20px 0'
  };

  return (
    <div style={styles}>
      <Container className="mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px', padding: '20px' }}>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center text-success">🌱 Your Carbon Footprint Data</h2>
          </Col>
        </Row>

        {/* Search Form - Now shows logged-in user's email by default */}
        <Row className="justify-content-center">
          <Col md={6}>
            <Form>
              <Form.Group controlId="searchEmail">
                <Form.Label>Your Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  readOnly // Make the field read-only so user can't change it
                />
                <Form.Text className="text-muted">
                  You can only view your own carbon footprint data
                </Form.Text>
              </Form.Group>
              <div className="d-flex justify-content-between mt-3">
                <Button variant="primary" onClick={handleSearch}>
                  Load My Data
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Form>

            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Col>
        </Row>

        {/* Only show results if it's the user's own data */}
        {searchResult && searchEmail === userEmail && (
          <Row className="justify-content-center mt-5">
            <Col md={8}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-info">Your Carbon Footprint</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    Total Emissions: {searchResult.totalEmission} kg CO₂
                  </Card.Subtitle>

                  {/* 🏅 Badges */}
                  {userBadges.length > 0 && (
                    <div className="mb-3">
                      <h6>🏅 Your Achievements:</h6>
                      <ul>
                        {userBadges.map((badge, idx) => (
                          <li key={idx}>
                            {badge === 'Green Champion' && '🥇 '}
                            {badge === 'Eco Commuter' && '🚴 '}
                            {badge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ⚠️ Offset Suggestions */}
                  {searchResult.totalEmission > 100 && (
                    <Alert variant="warning">
                      <strong>⚠️ High Emissions Alert:</strong> Consider reducing your footprint:
                      <ul>
                        <li>💡 Turn off unused appliances</li>
                        <li>🚴 Use public or eco-friendly transport</li>
                        <li>🌳 Offset emissions by planting trees</li>
                      </ul>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          href="https://tree-nation.com"
                          target="_blank"
                        >
                          🌱 Plant Trees
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          href="https://carbonfund.org/donate/"
                          target="_blank"
                        >
                          💰 Offset on CarbonFund
                        </Button>
                      </div>
                    </Alert>
                  )}

                  <h5>Your Recent Activities:</h5>
                  <ul>
                    {searchResult.activities.map((activity, idx) => (
                      <li key={idx}>
                        <strong>{activity.activityType}</strong> - {activity.value} {activity.unit || 'units'} → {activity.emission} kg CO₂
                        <br />
                        <small className="text-muted">{activity.timestamp}</small>
                      </li>
                    ))}
                  </ul>

                  {/* ✅ Total Carbon after Activities */}
                  <p className="mt-3 fw-bold text-success">
                    ✅ Your Total Carbon Emission: {searchResult.totalEmission.toFixed(2)} kg CO₂
                  </p>

                  {/* Report Buttons */}
                  <div className="mt-4 d-flex gap-3">
                    <Button variant="outline-success" onClick={handleDownloadPDF}>
                      📄 Download PDF Report
                    </Button>
                    <Button variant="outline-info" onClick={handleDownloadExcel}>
                      📊 Download Excel Report
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;