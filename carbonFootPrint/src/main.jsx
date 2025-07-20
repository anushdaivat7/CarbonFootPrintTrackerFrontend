import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import ActivityForm from './pages/ActivityForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Dashboard1 from './pages/Dashboard1.jsx';
import ChartDisplayPage from './pages/ChartDisplayPage.jsx'; 
import EmissionChartPage from './pages/EmissionChartPage';
// import EmissionChartPage from './EmissionChartPage';
// import ChartDisplayPage from './ChartDisplayPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />       
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/activity" element={<ActivityForm />} />
           <Route path="/dashboard1" element={<Dashboard1 />} />
           <Route path="/visualization" element={<EmissionChartPage />} />
           <Route path="/chart/:range" element={<ChartDisplayPage />} />   
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
