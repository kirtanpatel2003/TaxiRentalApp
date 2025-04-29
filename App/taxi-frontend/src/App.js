import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import ManagerDashboard from './pages/ManagerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import DriverDashboard from './pages/DriverDashboard';

function LayoutWrapper({ children }) {
  const location = useLocation();
  const showNavbar = location.pathname === '/manager-dashboard' || location.pathname === '/client-dashboard' || location.pathname === '/driver-dashboard';

  return (
    <>
      {showNavbar && <AppNavbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
