import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // ✅ Fix: use `name`, not `fullname`
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      email: formData.email,
      password: formData.password
    });

    const { id, email, fullName } = response.data;

    if (id && fullName && email) {
      localStorage.setItem("userId", id);
      localStorage.setItem("email", email);
      localStorage.setItem("fullName", fullName);

      // ✅ Show full name in success alert
      alert(`Login successful! Welcome, ${fullName}`);
      window.location.href = "/dashboard1";
    } else {
      alert("Login failed. Invalid response.");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please check your credentials.");
  }
};

  const forestPattern = encodeURIComponent(`
    <svg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'>
      <rect width='400' height='400' fill='#00796b'/>
      <path d='M100 200 L150 100 L200 200 Z' fill='#00897b'/>
      <path d='M250 200 L300 100 L350 200 Z' fill='#00897b'/>
      <path d='M50 250 L100 150 L150 250 Z' fill='#009688'/>
      <path d='M200 250 L250 150 L300 250 Z' fill='#009688'/>
      <rect x='120' y='200' width='10' height='50' fill='#5d4037'/>
      <rect x='270' y='200' width='10' height='50' fill='#5d4037'/>
      <circle cx='50' cy='300' r='30' fill='#4db6ac'/>
      <circle cx='150' cy='350' r='40' fill='#26a69a'/>
      <circle cx='300' cy='320' r='35' fill='#4db6ac'/>
    </svg>
  `);

  return (
    <div className="auth-page">
      <div className="auth-image-container" style={{
        backgroundImage: `url("data:image/svg+xml;utf8,${forestPattern}")`,
        backgroundSize: 'cover'
      }}>
        <div className="auth-image-overlay">
          <h1>Welcome Back!</h1>
          <p>Track your forest's carbon footprint</p>
        </div>
      </div>

      <div className="auth-form-container">
        <form onSubmit={handleSubmit}>
          <div className="logo" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#00796b' }}>CarboonFootprint</h2>
          </div>

          <h2>Login to Your Account</h2>

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

          <button type="submit" className="auth-button" style={{ backgroundColor: '#00796b' }}>
            Login
          </button>

          <div className="auth-footer">
            <p>Don't have an account? <a href="/signup" style={{ color: '#00796b' }}>Sign up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;




