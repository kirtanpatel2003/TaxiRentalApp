import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

function Login() {
  const [ssn, setSSN] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1303/api/login-manager', { ssn }, { withCredentials: true });
      setMessage(response.data.message);
      setSSN(''); // Clear input after login
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
      <h2 className="text-center mb-4">Manager Login 🚖</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <Form onSubmit={handleSubmit}>
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

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
