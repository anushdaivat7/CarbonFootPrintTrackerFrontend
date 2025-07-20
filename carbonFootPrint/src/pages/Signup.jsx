import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/carbon/register", {
        fullName: formData.fullname, // ✅ fixed this line
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      console.log("Full Axios response:", response);

      if (response.status === 200 || response.status === 201) {
        alert("Signup successful!");
            
          localStorage.setItem("name", formData.fullName);
          localStorage.setItem("email", formData.email);
        // Clear form
        setFormData({
          fullname: '', // ✅ fixed from name: ''
          email: '',
          password: '',
          confirmPassword: ''
        });

        // Redirect to login
        window.location.href = "/login";
      } else {
        alert("Signup failed. Please try again.");
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Signup failed: ${error.response.data.message}`);
      } else {
        alert("An error occurred. Please try again.");
      }
      console.error("Error during signup:", error);
    }
  };

  const footprintPattern = encodeURIComponent(`
    <svg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'>
      <rect width='400' height='400' fill='#00695c'/>
      <path d='M200 100 Q250 50 300 100 T400 100' stroke='#4db6ac' stroke-width='8' fill='none'/>
      <path d='M200 150 Q250 100 300 150 T400 150' stroke='#80cbc4' stroke-width='6' fill='none'/>
      <path d='M200 200 Q250 150 300 200 T400 200' stroke='#b2dfdb' stroke-width='4' fill='none'/>
      <circle cx='100' cy='150' r='40' fill='#00897b' opacity='0.8'/>
      <circle cx='150' cy='250' r='50' fill='#00796b' opacity='0.8'/>
      <circle cx='250' cy='300' r='45' fill='#009688' opacity='0.8'/>
      <path d='M50 350 L100 300 L150 350 L200 300 L250 350 L300 300 L350 350' 
            stroke='#b2dfdb' stroke-width='3' fill='none'/>
    </svg>
  `);

  return (
    <div className="auth-page">
      <div className="auth-image-container" style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${footprintPattern}")`,
        backgroundSize: 'cover'
      }}>
        <div className="auth-image-overlay">
          <h1>Join Our Mission!</h1>
          <p>Reduce your carbon footprint with us</p>
        </div>
      </div>

      <div className="auth-form-container">
        <form onSubmit={handleSubmit}>
          <div className="logo" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#00695c' }}>CarboonFootprint</h2>
          </div>

          <h2>Create Your Account</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullname" // ✅ fixed here from name="name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button" style={{ backgroundColor: '#00695c' }}>
            Sign Up
          </button>

          <div className="auth-footer">
            <p>Already have an account? <a href="/login" style={{ color: '#00695c' }}>Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
