import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

function Login() {
  const [role, setRole] = useState('manager');
  const [ssn, setSSN] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = role === 'manager' ? '/api/login-manager' : '/api/login-client';
      const payload = role === 'manager' ? { ssn } : { email };

      const response = await axios.post(`http://localhost:1303${endpoint}`, payload, { withCredentials: true });
      setMessage(response.data.message);
      setSSN('');
      setEmail('');
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Login</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formRole">
          <Form.Label>Login as:</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="manager">Manager</option>
            <option value="client">Client</option>
          </Form.Select>
        </Form.Group>

        {role === 'manager' ? (
          <Form.Group className="mb-4" controlId="formSSN">
            <Form.Label>SSN</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter your SSN" 
              value={ssn}
              onChange={(e) => setSSN(e.target.value)}
              required
            />
          </Form.Group>
        ) : (
          <Form.Group className="mb-4" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
