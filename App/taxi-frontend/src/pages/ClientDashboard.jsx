import React from 'react';
import { Container } from 'react-bootstrap';

function ClientDashboard({ name = "Client" }) {
  return (
    <Container className="mt-5 text-center">
      <h2>Welcome, {name}!</h2>
      <p>This is your client dashboard. More features coming soon.</p>
    </Container>
  );
}

export default ClientDashboard;