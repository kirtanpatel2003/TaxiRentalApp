import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [role, setRole] = useState('manager');
  const [ssn, setSSN] = useState('');
  const [email, setEmail] = useState('');
  const [driverName, setDriverName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
      let payload = {};

      if (role === 'manager') {
        endpoint = '/api/login-manager';
        payload = { ssn };
      } else if (role === 'client') {
        endpoint = '/api/login-client';
        payload = { email };
      } else {
        endpoint = '/api/login-driver';
        payload = { name: driverName };
      }

      const res = await axios.post(`http://localhost:1303${endpoint}`, payload, { withCredentials: true });
      const name = res.data.manager?.name || res.data.client?.name || res.data.driver?.name || res.data.name;

      setMessage(res.data.message);
      setSSN(''); setEmail(''); setDriverName('');

      if (role === 'manager') {
        navigate('/manager-dashboard', { state: { name } });
      } else if (role === 'client') {
        navigate('/client-dashboard', { state: { name } });
      } else {
        navigate('/driver-dashboard', { state: { name } });
      }

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login to Taxi Rental</h2>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Select Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="manager">Manager</option>
              <option value="client">Client</option>
              <option value="driver">Driver</option>
            </Form.Select>
          </Form.Group>

          {role === 'manager' && (
            <Form.Group className="mb-3" controlId="formSSN">
              <Form.Label>Manager SSN</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter SSN"
                value={ssn}
                onChange={(e) => setSSN(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {role === 'client' && (
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Client Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          )}

          {role === 'driver' && (
            <Form.Group className="mb-3" controlId="formDriverName">
              <Form.Label>Driver Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Button type="submit" variant="primary" className="w-100">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
