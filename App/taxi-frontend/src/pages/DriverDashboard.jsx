import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';

function DriverDashboard() {
  const location = useLocation();
  const name = location.state?.name || 'Driver';

  return (
    <Container className="mt-5 text-center">
      <h2>Welcome, {name}!</h2>
      <p>This is your Driver Dashboard.</p>
    </Container>
  );
}

export default DriverDashboard;