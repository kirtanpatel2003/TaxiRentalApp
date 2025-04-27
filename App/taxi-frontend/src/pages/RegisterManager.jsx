import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

function RegisterManager() {
  const [formData, setFormData] = useState({
    name: '',
    ssn: '',
    email: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1303/api/register-manager', formData, { withCredentials: true });
      setMessage(response.data.message);
      setFormData({ name: '', ssn: '', email: '' }); // Clear form
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">Register Manager 🚖</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter your name" 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formSSN">
          <Form.Label>SSN</Form.Label>
          <Form.Control 
            type="text" 
            name="ssn" 
            value={formData.ssn} 
            onChange={handleChange} 
            placeholder="Enter your SSN" 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter your email" 
            required 
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    </Container>
  );
}

export default RegisterManager;
