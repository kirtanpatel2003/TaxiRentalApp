import React from 'react';
import { Container } from 'react-bootstrap';

function ManagerDashboard({ name = "Manager" }) {
  return (
    <Container className="mt-5 text-center">
      <h2>Welcome, Manager {name}!</h2>
      <p>This is your dashboard. More features coming soon.</p>
    </Container>
  );
}

export default ManagerDashboard;